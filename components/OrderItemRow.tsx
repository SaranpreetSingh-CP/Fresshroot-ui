"use client";

import { Input } from "@/components/FormFields";
import VegetableDropdown from "@/components/VegetableDropdown";
import type { Vegetable } from "@/services/vegetable.service";
import type { OrderItemInput } from "@/utils/types";

interface OrderItemRowProps {
	index: number;
	item: OrderItemInput;
	vegetables: Vegetable[];
	vegetablesLoading?: boolean;
	/** Vegetable IDs already selected in other rows */
	selectedVegIds: number[];
	/** Currently selected vegetable ID for this row */
	vegId: number | null;
	onUpdate: (
		index: number,
		field: keyof OrderItemInput,
		value: string | number,
	) => void;
	onVegSelect: (index: number, veg: Vegetable) => void;
	onRemove: (index: number) => void;
	canRemove: boolean;
}

export default function OrderItemRow({
	index,
	item,
	vegetables,
	vegetablesLoading,
	selectedVegIds,
	vegId,
	onUpdate,
	onVegSelect,
	onRemove,
	canRemove,
}: OrderItemRowProps) {
	const selectedVeg = vegetables.find((v) => v.id === vegId);

	return (
		<div className="rounded-lg border border-gray-200 p-3 space-y-2">
			<div className="flex items-start gap-2">
				{/* Vegetable dropdown */}
				<div className="flex-1">
					<VegetableDropdown
						id={`veg-${index}`}
						vegetables={vegetables}
						value={vegId}
						onChange={(veg) => onVegSelect(index, veg)}
						excludeIds={selectedVegIds}
						isLoading={vegetablesLoading}
					/>
				</div>

				{/* Quantity */}
				<div className="w-24 flex-shrink-0">
					<Input
						label="Qty"
						id={`qty-${index}`}
						type="number"
						min={1}
						value={item.quantity}
						onChange={(e) =>
							onUpdate(index, "quantity", Number(e.target.value))
						}
					/>
				</div>

				{/* Unit (auto-filled, read-only indicator) */}
				<div className="w-24 flex-shrink-0">
					<div className="space-y-1">
						<label className="block text-sm font-medium text-gray-700">
							Unit
						</label>
						<div className="flex h-[38px] items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
							{selectedVeg?.unit ?? item.unit}
						</div>
					</div>
				</div>

				{/* Remove */}
				{canRemove && (
					<button
						type="button"
						onClick={() => onRemove(index)}
						className="mt-6 flex-shrink-0 rounded-full p-1.5 text-red-500 hover:bg-red-50 transition"
						title="Remove item"
					>
						✕
					</button>
				)}
			</div>
		</div>
	);
}
