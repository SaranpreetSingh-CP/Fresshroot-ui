"use client";

import { useState, type FormEvent } from "react";
import { Select } from "@/components/FormFields";
import Button from "@/components/Button";
import OrderItemRow from "@/components/OrderItemRow";
import { useVegetables } from "@/hooks/useVegetables";
import type { Vegetable } from "@/services/vegetable.service";
import type { OrderItemInput, OrderFormData, OrderStatus } from "@/utils/types";

/* ── Helpers ────────────────────────────────────────────────────── */

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "processing", label: "Processing" },
	{ value: "delivered", label: "Delivered" },
];

interface ItemRow extends OrderItemInput {
	vegId: number | null;
}

const emptyRow: ItemRow = {
	vegId: null,
	itemName: "",
	quantity: 1,
	unit: "kg",
};

/* ── Props ──────────────────────────────────────────────────────── */

interface OrderFormProps {
	customers: { value: string; label: string }[];
	/** Pre-fill for editing */
	initial?: Partial<OrderFormData> & {
		id?: string;
		/** Items with vegId for pre-selection */
		itemRows?: ItemRow[];
	};
	onSubmit: (data: OrderFormData, id?: string) => void;
	isSubmitting?: boolean;
}

/* ── Component ──────────────────────────────────────────────────── */

export default function OrderForm({
	customers,
	initial,
	onSubmit,
	isSubmitting,
}: OrderFormProps) {
	const { data: vegetables = [], isLoading: vegLoading } = useVegetables();
	const isEdit = Boolean(initial?.id);

	const [customerId, setCustomerId] = useState(initial?.customerId ?? "");
	const [status, setStatus] = useState<OrderStatus>(
		initial?.status ?? "pending",
	);
	const [rows, setRows] = useState<ItemRow[]>(
		initial?.itemRows?.length ? initial.itemRows : [{ ...emptyRow }],
	);
	const [errors, setErrors] = useState<{
		customer?: string;
		items?: string;
	}>({});

	/* ── Row helpers ─────────────────────────────────────────── */

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
		setErrors((prev) => {
			const n = { ...prev };
			delete n.items;
			return n;
		});
	}

	/* ── Validation ──────────────────────────────────────────── */

	function validate(): boolean {
		const e: typeof errors = {};
		if (!customerId) e.customer = "Select a customer";
		if (rows.length === 0) e.items = "Add at least one item";
		else if (rows.some((r) => r.vegId === null || r.quantity <= 0))
			e.items = "Select a vegetable and enter quantity > 0 for each item";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	/* ── Submit ──────────────────────────────────────────────── */

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit(
			{
				customerId,
				items: rows.map(({ itemName, quantity, unit }) => ({
					itemName,
					quantity,
					unit,
				})),
				status,
			},
			initial?.id,
		);
	}

	const selectedVegIds = rows
		.map((r) => r.vegId)
		.filter((id): id is number => id !== null);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			{/* Customer + Status row */}
			<div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<Select
						label="Customer *"
						id="order-customer"
						options={customers}
						value={customerId}
						onChange={(e) => {
							setCustomerId(e.target.value);
							setErrors((prev) => {
								const n = { ...prev };
								delete n.customer;
								return n;
							});
						}}
					/>
					{errors.customer && (
						<p className="mt-1 text-xs text-red-600">{errors.customer}</p>
					)}
				</div>

				<Select
					label="Status"
					id="order-status"
					options={ORDER_STATUSES.map((s) => ({
						value: s.value,
						label: s.label,
					}))}
					value={status}
					onChange={(e) => setStatus(e.target.value as OrderStatus)}
				/>
			</div>

			{/* Items */}
			<div className="flex-1 min-h-0 space-y-3">
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

				{errors.items && <p className="text-xs text-red-600">{errors.items}</p>}
			</div>

			<div className="flex justify-end pt-3 flex-shrink-0 border-t border-gray-100">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? isEdit
							? "Updating…"
							: "Creating…"
						: isEdit
							? "Update Order"
							: "Create Order"}
				</Button>
			</div>
		</form>
	);
}
