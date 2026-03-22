"use client";

import { useState, type FormEvent } from "react";
import { Input, Select } from "@/components/FormFields";
import Button from "@/components/Button";
import type { OrderItemInput } from "@/utils/types";

interface OrderFormProps {
	customers: { value: string; label: string }[];
	onSubmit: (data: { customerId: string; items: OrderItemInput[] }) => void;
	isSubmitting?: boolean;
}

const emptyItem: OrderItemInput = { itemName: "", quantity: 1, unit: "kg" };

export default function OrderForm({
	customers,
	onSubmit,
	isSubmitting,
}: OrderFormProps) {
	const [customerId, setCustomerId] = useState("");
	const [items, setItems] = useState<OrderItemInput[]>([{ ...emptyItem }]);
	const [errors, setErrors] = useState<{ customer?: string; items?: string }>(
		{},
	);

	function addItem() {
		setItems((prev) => [...prev, { ...emptyItem }]);
	}

	function removeItem(index: number) {
		setItems((prev) => prev.filter((_, i) => i !== index));
	}

	function updateItem(
		index: number,
		field: keyof OrderItemInput,
		value: string | number,
	) {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	}

	function validate(): boolean {
		const e: typeof errors = {};
		if (!customerId) e.customer = "Select a customer";
		if (items.length === 0) e.items = "Add at least one item";
		else if (items.some((it) => !it.itemName.trim() || it.quantity <= 0))
			e.items = "Each item needs a name and quantity > 0";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit({ customerId, items });
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Customer select */}
			<div>
				<Select
					label="Customer *"
					id="order-customer"
					options={customers}
					value={customerId}
					onChange={(e) => {
						setCustomerId(e.target.value);
						setErrors((prev) => ({ ...prev, customer: undefined }));
					}}
				/>
				{errors.customer && (
					<p className="mt-1 text-xs text-red-600">{errors.customer}</p>
				)}
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

				{items.map((item, idx) => (
					<div
						key={idx}
						className="flex items-end gap-2 rounded-lg border border-gray-200 p-3"
					>
						<div className="flex-1">
							<Input
								label="Item Name"
								id={`item-name-${idx}`}
								value={item.itemName}
								onChange={(e) => updateItem(idx, "itemName", e.target.value)}
								placeholder="e.g. Tomatoes"
							/>
						</div>
						<div className="w-24">
							<Input
								label="Qty"
								id={`item-qty-${idx}`}
								type="number"
								min={1}
								value={item.quantity}
								onChange={(e) =>
									updateItem(idx, "quantity", Number(e.target.value))
								}
							/>
						</div>
						<div className="w-28">
							<Select
								label="Unit"
								id={`item-unit-${idx}`}
								options={[
									{ value: "kg", label: "kg" },
									{ value: "piece", label: "piece" },
								]}
								value={item.unit}
								onChange={(e) => updateItem(idx, "unit", e.target.value)}
							/>
						</div>
						{items.length > 1 && (
							<button
								type="button"
								onClick={() => removeItem(idx)}
								className="mb-0.5 rounded-full p-1.5 text-red-500 hover:bg-red-50 transition"
								title="Remove item"
							>
								✕
							</button>
						)}
					</div>
				))}

				{errors.items && <p className="text-xs text-red-600">{errors.items}</p>}
			</div>

			<div className="flex justify-end pt-2">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creating…" : "Create Order"}
				</Button>
			</div>
		</form>
	);
}
