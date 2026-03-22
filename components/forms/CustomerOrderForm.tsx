"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import OrderItemRow from "@/components/OrderItemRow";
import { useVegetables } from "@/hooks/useVegetables";
import type { Vegetable } from "@/services/vegetable.service";
import type { OrderItemInput } from "@/utils/types";

interface CustomerOrderFormProps {
	onSubmit: (items: OrderItemInput[]) => void;
	isSubmitting?: boolean;
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
}: CustomerOrderFormProps) {
	const { data: vegetables = [], isLoading: vegLoading } = useVegetables();
	const [rows, setRows] = useState<ItemRow[]>([{ ...emptyRow }]);
	const [error, setError] = useState("");

	function addItem() {
		setRows((prev) => [...prev, { ...emptyRow }]);
	}

	function removeItem(index: number) {
		setRows((prev) => prev.filter((_, i) => i !== index));
	}

	function updateItem(
		index: number,
		field: keyof OrderItemInput,
		value: string | number,
	) {
		setRows((prev) =>
			prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
		);
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

	function validate(): boolean {
		if (rows.length === 0) {
			setError("Add at least one item");
			return false;
		}
		if (rows.some((r) => r.vegId === null || r.quantity <= 0)) {
			setError("Select a vegetable and enter quantity > 0 for each item");
			return false;
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
		);
	}

	const selectedVegIds = rows
		.map((r) => r.vegId)
		.filter((id): id is number => id !== null);

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
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
							onUpdate={updateItem}
							onVegSelect={handleVegSelect}
							onRemove={removeItem}
							canRemove={rows.length > 1}
						/>
					))}
				</div>

				{error && <p className="text-xs text-red-600">{error}</p>}
			</div>

			<div className="flex justify-end pt-2">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Placing Order…" : "Place Order"}
				</Button>
			</div>
		</form>
	);
}
