"use client";

import Modal from "@/components/Modal";
import Badge from "@/components/Badge";
import PlanOverview from "@/components/PlanOverview";
import VegetableLimitList from "@/components/VegetableLimitList";
import type { VegLimit } from "@/components/VegetableLimitList";
import { usePlanUsage } from "@/hooks/useDashboard";
import type { AdminCustomer } from "@/utils/types";

interface PlanSummaryModalProps {
	open: boolean;
	onClose: () => void;
	customer: AdminCustomer | null;
	onEdit?: (customer: AdminCustomer) => void;
}

/**
 * Full-screen-on-mobile / modal-on-desktop view of a customer's
 * plan, usage stats, and per-vegetable limits.
 */
export default function PlanSummaryModal({
	open,
	onClose,
	customer,
	onEdit,
}: PlanSummaryModalProps) {
	// Fetch live plan-usage (used/remaining) when the modal is open
	const { data: planUsage, isLoading: usageLoading } = usePlanUsage(
		customer?.id ?? "",
	);

	if (!customer) return null;

	// Derive totalQty from either the object form or the live API response
	const totalQty =
		planUsage?.totalQty ??
		(customer.plan && typeof customer.plan === "object"
			? customer.plan.totalQty
			: null);

	const hasPlanData = totalQty != null;

	// Build veg limits: prefer live planUsage data, fall back to static customer.vegetableLimits
	const enrichedLimits: VegLimit[] = (() => {
		if (planUsage) {
			// Start with pieceUsage from API (already has limitQty/usedQty/remainingQty)
			const fromPiece: VegLimit[] = (planUsage.pieceUsage ?? []).map((p) => ({
				vegetableId: p.vegetableId,
				vegetableName: p.vegetableName,
				limitQty: p.limitQty,
				usedQty: p.usedQty,
				remainingQty: p.remainingQty,
				unit: "piece" as const,
			}));

			// Also include kg-based vegetableUsage if present
			const fromKg: VegLimit[] = (planUsage.vegetableUsage ?? [])
				.filter((v) => v.limit != null)
				.map((v) => ({
					vegetableId: v.vegetableId,
					vegetableName: v.vegetableName,
					limitQty: v.limit!,
					usedQty: v.used,
					remainingQty: v.limit! - v.used,
					unit: "kg" as const,
				}));

			// Combine, deduplicating by vegetableId (piece takes priority)
			const pieceIds = new Set(fromPiece.map((p) => p.vegetableId));
			return [
				...fromPiece,
				...fromKg.filter((k) => !pieceIds.has(k.vegetableId)),
			];
		}

		// Fallback to static limits from the customer object
		return (customer.vegetableLimits ?? []).map((sl) => ({
			vegetableId: sl.vegetableId,
			vegetableName: sl.vegetableName,
			limitQty: sl.limitQty ?? sl.maxQty ?? 0,
			unit: (sl.unit ?? "piece") as "kg" | "piece",
		}));
	})();

	return (
		<Modal
			open={open}
			onClose={onClose}
			title="Customer Plan Summary"
			className="max-w-xl sm:max-w-2xl"
		>
			<div className="space-y-6">
				{/* ─── SECTION 1: Basic Info ───────────────────── */}
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1 space-y-1">
						<h3 className="text-lg font-bold text-gray-900 truncate">
							{customer.name}
						</h3>
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
							{customer.phone && (
								<span className="flex items-center gap-1">
									📞 {customer.phone}
								</span>
							)}
							{customer.email && (
								<span className="flex items-center gap-1 truncate">
									✉️ {customer.email}
								</span>
							)}
						</div>
					</div>

					{/* Status badge */}
					<Badge variant={customer.status === "active" ? "green" : "gray"}>
						{customer.status ?? "unknown"}
					</Badge>
				</div>

				{/* ─── SECTION 2: Plan Overview ────────────────── */}
				{hasPlanData && planUsage ? (
					<div className="space-y-2">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
							Plan Overview
						</h4>
						<PlanOverview
							totalQty={planUsage.totalQty}
							usedQty={planUsage.usedQty}
							remainingQty={planUsage.remainingQty}
							unit={planUsage.unit ?? "kg"}
						/>
					</div>
				) : hasPlanData ? (
					<div className="space-y-2">
						<h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
							Plan Overview
						</h4>
						{usageLoading ? (
							<div className="flex items-center gap-2 py-4 text-sm text-gray-400">
								<span className="animate-pulse">●</span> Loading usage…
							</div>
						) : (
							<p className="text-sm text-gray-600">
								Total Plan: <strong>{totalQty} kg</strong>
							</p>
						)}
					</div>
				) : (
					<div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-400 italic">
						No plan assigned
					</div>
				)}

				{/* ─── SECTION 3: Vegetable Limits ─────────────── */}
				<div className="space-y-2">
					<h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
						Vegetable Limits
						{enrichedLimits.length > 0 && (
							<span className="ml-1.5 text-gray-400">
								({enrichedLimits.length})
							</span>
						)}
					</h4>
					<VegetableLimitList limits={enrichedLimits} />
				</div>

				{/* ─── SECTION 4: Actions ──────────────────────── */}
				<div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
					<button
						onClick={onClose}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
					>
						Close
					</button>
					{onEdit && (
						<button
							onClick={() => {
								onClose();
								onEdit(customer);
							}}
							className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
						>
							Edit Customer
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
}
