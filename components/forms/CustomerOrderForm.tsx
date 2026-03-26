"use client";

import { useState, useMemo, type FormEvent } from "react";
import { Input, Select } from "@/components/FormFields";
import Button from "@/components/Button";
import OrderItemRow from "@/components/OrderItemRow";
import QuantityTracker from "@/components/QuantityTracker";
import { useVegetables } from "@/hooks/useVegetables";
import type { Vegetable } from "@/services/vegetable.service";
import type { OrderItemInput, PlanUsage, VegetableUsage } from "@/utils/types";
import type { VegLimitInfo } from "@/components/OrderItemRow";

interface CustomerOrderFormProps {
	onSubmit: (items: OrderItemInput[], date: string) => void;
	isSubmitting?: boolean;
	/** Plan usage data — enables limit tracking when provided */
	planUsage?: PlanUsage | null;
}

interface ItemRow extends OrderItemInput {
	vegId: number | null;
}

const emptyRow: ItemRow = {
	vegId: null,
	itemName: "",
	quantity: 1,
	unit: "kg",
};

export default function CustomerOrderForm({
	onSubmit,
	isSubmitting,
	planUsage,
}: CustomerOrderFormProps) {
	const { data: vegetables = [], isLoading: vegLoading } = useVegetables();
	const todayISO = new Date().toISOString().slice(0, 10);

	// Generate next 8 weeks of Wed (3) & Sat (6) delivery dates
	const deliveryDateOptions = useMemo(() => {
		const options: { value: string; label: string }[] = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const d = new Date(today);
		d.setDate(d.getDate() + 1); // start from tomorrow
		const end = new Date(today);
		end.setDate(end.getDate() + 56); // 8 weeks ahead
		while (d <= end) {
			const day = d.getDay(); // 0=Sun … 3=Wed … 6=Sat
			if (day === 3 || day === 6) {
				const iso = d.toISOString().slice(0, 10);
				const label = d.toLocaleDateString("en-IN", {
					weekday: "short",
					day: "2-digit",
					month: "short",
					year: "numeric",
				});
				options.push({ value: iso, label });
			}
			d.setDate(d.getDate() + 1);
		}
		return options;
	}, []);

	const [rows, setRows] = useState<ItemRow[]>([{ ...emptyRow }]);
	const [date, setDate] = useState(deliveryDateOptions[0]?.value ?? todayISO);
	const [error, setError] = useState("");

	/* -- Derived data ------------------------------------------- */

	// Build a lookup: vegId → VegetableUsage from planUsage
	const usageByVegId = useMemo(() => {
		const map = new Map<number, VegetableUsage>();
		if (planUsage?.vegetableUsage) {
			for (const vu of planUsage.vegetableUsage) {
				map.set(vu.vegetableId, vu);
			}
		}
		return map;
	}, [planUsage]);

	// Total qty allocated in this order (all rows, only kg items counted toward global)
	const allocatedQty = useMemo(() => {
		return rows.reduce((sum, r) => {
			if (r.vegId === null) return sum;
			// Only count rows whose unit matches the plan unit (usually kg)
			if (r.unit === (planUsage?.unit ?? "kg")) return sum + r.quantity;
			return sum;
		}, 0);
	}, [rows, planUsage]);

	// Per-vegId: total qty allocated in this order (for combining duplicate rows)
	const allocatedByVeg = useMemo(() => {
		const map = new Map<number, number>();
		for (const r of rows) {
			if (r.vegId === null) continue;
			map.set(r.vegId, (map.get(r.vegId) ?? 0) + r.quantity);
		}
		return map;
	}, [rows]);

	// Global remaining
	const globalRemaining = planUsage
		? planUsage.totalQty - planUsage.usedQty - allocatedQty
		: null;

	/* -- Helpers ------------------------------------------------ */

	/** Build VegLimitInfo for a specific row */
	function getLimitInfo(row: ItemRow, rowIndex: number): VegLimitInfo | null {
		if (row.vegId === null) return null;
		const usage = usageByVegId.get(row.vegId);
		if (!usage || usage.limit === null) return null;

		// otherRowsQty = total allocated for this vegId MINUS this row's qty
		const totalForVeg = allocatedByVeg.get(row.vegId) ?? 0;
		const otherRowsQty = totalForVeg - row.quantity;

		return {
			limit: usage.limit,
			used: usage.used,
			unit: usage.unit,
			otherRowsQty: Math.max(otherRowsQty, 0),
		};
	}

	function addItem() {
		setRows((prev) => [...prev, { ...emptyRow }]);
	}

	function removeItem(index: number) {
		setRows((prev) => prev.filter((_, i) => i !== index));
		setError("");
	}

	function updateItem(
		index: number,
		field: keyof OrderItemInput,
		value: string | number,
	) {
		setRows((prev) =>
			prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
		);
		setError("");
	}

	function handleVegSelect(index: number, veg: Vegetable) {
		setRows((prev) =>
			prev.map((row, i) =>
				i === index
					? { ...row, vegId: veg.id, itemName: veg.name, unit: veg.unit }
					: row,
			),
		);
		setError("");
	}

	/* -- Validation --------------------------------------------- */

	function validate(): boolean {
		if (!date) {
			setError("Please select a delivery date");
			return false;
		}
		const selectedDay = new Date(date).getDay();
		if (selectedDay !== 3 && selectedDay !== 6) {
			setError("Delivery is only available on Wednesdays and Saturdays");
			return false;
		}
		if (date < todayISO) {
			setError("Delivery date cannot be in the past");
			return false;
		}
		if (rows.length === 0) {
			setError("Add at least one item");
			return false;
		}
		if (rows.some((r) => r.vegId === null || r.quantity <= 0)) {
			setError("Select a vegetable and enter quantity > 0 for each item");
			return false;
		}

		// Global plan limit check
		if (globalRemaining !== null && globalRemaining < 0) {
			setError(
				`Total order exceeds plan limit by ${Math.abs(globalRemaining)} ${planUsage?.unit ?? "kg"}. Please reduce quantities.`,
			);
			return false;
		}

		// Per-vegetable limit check
		for (const row of rows) {
			if (row.vegId === null) continue;
			const usage = usageByVegId.get(row.vegId);
			if (!usage || usage.limit === null) continue;

			const totalForVeg = allocatedByVeg.get(row.vegId) ?? 0;
			const vegRemaining = usage.limit - usage.used - totalForVeg;
			if (vegRemaining < 0) {
				setError(
					`${row.itemName}: exceeds limit by ${Math.abs(vegRemaining)} ${usage.unit}`,
				);
				return false;
			}
		}

		setError("");
		return true;
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit(
			rows.map(({ itemName, quantity, unit }) => ({
				itemName,
				quantity,
				unit,
			})),
			date || todayISO,
		);
	}

	const selectedVegIds = rows
		.map((r) => r.vegId)
		.filter((id): id is number => id !== null);

	// Check which vegs have zero remaining (disable hint)
	const zeroRemainingVegIds = useMemo(() => {
		const set = new Set<number>();
		for (const [vegId, usage] of usageByVegId) {
			if (usage.limit !== null && usage.limit - usage.used <= 0) {
				set.add(vegId);
			}
		}
		return set;
	}, [usageByVegId]);

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Global Quantity Tracker */}
			{planUsage && (
				<QuantityTracker
					totalQty={planUsage.totalQty}
					usedQty={planUsage.usedQty}
					allocatedQty={allocatedQty}
					unit={planUsage.unit ?? "kg"}
				/>
			)}

			{/* Limits info tooltip */}
			{planUsage?.vegetableUsage && planUsage.vegetableUsage.length > 0 && (
				<div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-700">
					<span className="text-sm">ℹ️</span>
					<span>
						Limits apply to selected vegetables. Vegetables with limits are
						validated in real-time.
					</span>
				</div>
			)}

			{/* Delivery Date (Wed & Sat only) */}
			<div className="max-w-xs">
				<Select
					label="Delivery Date"
					id="customer-order-date"
					value={date}
					options={deliveryDateOptions}
					onChange={(e) => setDate(e.target.value)}
				/>
				<p className="mt-1 text-[11px] text-gray-400">
					Deliveries are available on Wednesdays &amp; Saturdays only
				</p>
			</div>

			{/* Items */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<label className="block text-sm font-medium text-gray-700">
						Items *
					</label>
					<Button type="button" variant="outline" size="sm" onClick={addItem}>
						+ Add Item
					</Button>
				</div>

				<div className="max-h-[24rem] overflow-y-auto space-y-3 pr-1">
					{rows.map((row, idx) => (
						<OrderItemRow
							key={idx}
							index={idx}
							item={row}
							vegetables={vegetables}
							vegetablesLoading={vegLoading}
							selectedVegIds={selectedVegIds}
							vegId={row.vegId}
							limitInfo={getLimitInfo(row, idx)}
							zeroRemaining={
								row.vegId !== null && zeroRemainingVegIds.has(row.vegId)
							}
							onUpdate={updateItem}
							onVegSelect={handleVegSelect}
							onRemove={removeItem}
							canRemove={rows.length > 1}
						/>
					))}
				</div>

				{error && (
					<p className="text-xs text-red-600 flex items-center gap-1">
						<span>⚠</span> {error}
					</p>
				)}
			</div>

			<div className="flex justify-end pt-2">
				<Button
					type="submit"
					disabled={
						isSubmitting || (globalRemaining !== null && globalRemaining < 0)
					}
				>
					{isSubmitting ? "Placing Order…" : "Place Order"}
				</Button>
			</div>
		</form>
	);
}
