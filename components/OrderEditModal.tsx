"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import VegetableDropdown from "@/components/VegetableDropdown";
import { useVegetables } from "@/hooks/useVegetables";
import type { CustomerUpcomingDelivery, PlanUsage } from "@/utils/types";
import type { Vegetable } from "@/services/vegetable.service";

interface ItemRow {
	vegetableId: number | null;
	quantity: number;
	unit: string;
}

interface OrderEditModalProps {
	open: boolean;
	onClose: () => void;
	delivery: CustomerUpcomingDelivery | null;
	planUsage: PlanUsage | null;
	/** Total qty already planned across other upcoming deliveries (excluding this one) */
	otherPlannedQty: number;
	onSave: (
		orderId: string,
		items: { vegetableId: number; quantity: number; unit: string }[],
	) => void;
	isSaving?: boolean;
}

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "2-digit",
		month: "short",
	});
}

export default function OrderEditModal({
	open,
	onClose,
	delivery,
	planUsage,
	otherPlannedQty,
	onSave,
	isSaving,
}: OrderEditModalProps) {
	const { data: vegetables = [], isLoading: vegLoading } = useVegetables();

	const [rows, setRows] = useState<ItemRow[]>([]);

	// Seed rows from the delivery when it changes
	useEffect(() => {
		if (!delivery) return;
		if (delivery.items.length === 0) {
			setRows([{ vegetableId: null, quantity: 0, unit: "kg" }]);
			return;
		}
		setRows(
			delivery.items.map((i) => ({
				vegetableId: i.vegetableId ?? null,
				quantity: i.quantity,
				unit: i.unit,
			})),
		);
	}, [delivery]);

	// Calculate totals
	const thisOrderQty = useMemo(
		() => rows.reduce((sum, r) => sum + (r.quantity > 0 ? r.quantity : 0), 0),
		[rows],
	);

	const remaining = planUsage
		? planUsage.remainingQty - otherPlannedQty - thisOrderQty
		: null;

	const isOverLimit = remaining !== null && remaining < 0;
	const hasInvalidRows = rows.some(
		(r) => r.vegetableId === null || r.quantity <= 0,
	);

	function updateRow(index: number, patch: Partial<ItemRow>) {
		setRows((prev) =>
			prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
		);
	}

	function removeRow(index: number) {
		setRows((prev) => prev.filter((_, i) => i !== index));
	}

	function addRow() {
		setRows((prev) => [
			...prev,
			{ vegetableId: null, quantity: 0, unit: "kg" },
		]);
	}

	function handleSave() {
		if (!delivery) return;
		const validItems = rows
			.filter((r) => r.vegetableId !== null && r.quantity > 0)
			.map((r) => ({
				vegetableId: r.vegetableId!,
				quantity: r.quantity,
				unit: r.unit,
			}));
		if (validItems.length === 0) return;
		onSave(delivery.orderId ?? delivery.id, validItems);
	}

	const usedVegIds = rows
		.map((r) => r.vegetableId)
		.filter((id): id is number => id !== null);

	if (!delivery) return null;

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={`Edit Delivery — ${formatDate(delivery.date)}`}
			className="max-w-xl"
		>
			<div className="space-y-5">
				{/* Live remaining counter */}
				{planUsage && (
					<div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
						<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
							Remaining after this order
						</span>
						<span
							className={`text-lg font-bold tabular-nums ${
								isOverLimit ? "text-red-600" : "text-green-600"
							}`}
						>
							{remaining}
							<span className="text-sm font-normal text-gray-400">
								{planUsage.unit}
							</span>
						</span>
					</div>
				)}

				{isOverLimit && (
					<p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
						⚠️ This order exceeds your remaining plan limit by{" "}
						{Math.abs(remaining!)}
						{planUsage?.unit}. Please reduce quantities.
					</p>
				)}

				{/* Item rows */}
				<div className="space-y-3">
					{rows.map((row, idx) => (
						<div
							key={idx}
							className="grid grid-cols-[1fr_80px_60px_32px] items-end gap-2"
						>
							<div>
								{idx === 0 && (
									<label className="mb-1 block text-xs font-medium text-gray-500">
										Vegetable
									</label>
								)}
								<VegetableDropdown
									vegetables={vegetables}
									value={row.vegetableId}
									onChange={(veg: Vegetable) =>
										updateRow(idx, {
											vegetableId: veg.id,
											unit: veg.unit,
										})
									}
									excludeIds={usedVegIds.filter((id) => id !== row.vegetableId)}
									isLoading={vegLoading}
								/>
							</div>

							<div>
								{idx === 0 && (
									<label className="mb-1 block text-xs font-medium text-gray-500">
										Qty
									</label>
								)}
								<input
									type="number"
									min={0}
									step={0.5}
									value={row.quantity || ""}
									onChange={(e) =>
										updateRow(idx, {
											quantity: parseFloat(e.target.value) || 0,
										})
									}
									className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
									placeholder="0"
								/>
							</div>

							<div className="flex items-center justify-center rounded-lg bg-gray-100 py-2 text-xs font-medium text-gray-500">
								{row.unit}
							</div>

							<button
								type="button"
								onClick={() => removeRow(idx)}
								className="flex h-9 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
								title="Remove"
							>
								✕
							</button>
						</div>
					))}
				</div>

				<button
					type="button"
					onClick={addRow}
					className="text-sm font-medium text-green-700 hover:text-green-800 transition"
				>
					+ Add item
				</button>

				{/* Footer */}
				<div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
					<p className="text-sm text-gray-500">
						Order total:{" "}
						<span className="font-semibold text-gray-900">
							{thisOrderQty}kg
						</span>
					</p>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={onClose}>
							Cancel
						</Button>
						<Button
							size="sm"
							disabled={
								isSaving || hasInvalidRows || isOverLimit || rows.length === 0
							}
							onClick={handleSave}
						>
							{isSaving ? "Saving…" : "Save Items"}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
