"use client";

import VegetableDropdown from "@/components/VegetableDropdown";
import { Input, Select } from "@/components/FormFields";
import type { VegetableLimitInput } from "@/utils/types";
import type { Vegetable } from "@/services/vegetable.service";

interface VegetableLimitRowProps {
	row: VegetableLimitInput;
	index: number;
	vegetables: Vegetable[];
	excludeIds: number[];
	isLoading?: boolean;
	onChange: (index: number, updated: VegetableLimitInput) => void;
	onRemove: (index: number) => void;
}

export default function VegetableLimitRow({
	row,
	index,
	vegetables,
	excludeIds,
	isLoading,
	onChange,
	onRemove,
}: VegetableLimitRowProps) {
	function handleVegSelect(veg: Vegetable) {
		onChange(index, {
			...row,
			vegetableId: veg.id,
			vegetableName: veg.name,
		});
	}

	function handleUnitChange(newUnit: "kg" | "piece") {
		onChange(index, {
			...row,
			unit: newUnit,
			maxQtyKg: newUnit === "kg" ? row.maxQtyKg : "",
			maxQtyPiece: newUnit === "piece" ? row.maxQtyPiece : "",
		});
	}

	return (
		<div className="flex items-start gap-3">
			{/* Vegetable selector */}
			<div className="min-w-[160px] flex-1">
				<VegetableDropdown
					vegetables={vegetables}
					value={row.vegetableId || null}
					onChange={handleVegSelect}
					excludeIds={excludeIds}
					isLoading={isLoading}
					id={`veg-limit-${index}`}
				/>
			</div>

			{/* Unit selector */}
			<div className="w-24">
				<Select
					label="Unit"
					id={`limit-unit-${index}`}
					value={row.unit}
					onChange={(e) => handleUnitChange(e.target.value as "kg" | "piece")}
					options={[
						{ value: "kg", label: "Kg" },
						{ value: "piece", label: "Pcs" },
					]}
				/>
			</div>

			{/* Limit input — changes based on selected unit */}
			{row.unit === "kg" ? (
				<div className="w-28">
					<Input
						label="Max Kg"
						id={`limit-kg-${index}`}
						type="number"
						min={0}
						step={0.25}
						value={row.maxQtyKg === "" ? "" : (row.maxQtyKg ?? "")}
						onChange={(e) =>
							onChange(index, {
								...row,
								maxQtyKg: e.target.value === "" ? "" : Number(e.target.value),
							})
						}
						placeholder="e.g. 5"
					/>
				</div>
			) : (
				<div className="w-28">
					<Input
						label="Max Pcs"
						id={`limit-pcs-${index}`}
						type="number"
						min={0}
						step={1}
						value={row.maxQtyPiece === "" ? "" : (row.maxQtyPiece ?? "")}
						onChange={(e) =>
							onChange(index, {
								...row,
								maxQtyPiece:
									e.target.value === "" ? "" : Number(e.target.value),
							})
						}
						placeholder="e.g. 10"
					/>
				</div>
			)}

			{/* Remove button */}
			<button
				type="button"
				onClick={() => onRemove(index)}
				className="mt-7 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
				aria-label="Remove limit"
			>
				✕
			</button>
		</div>
	);
}
