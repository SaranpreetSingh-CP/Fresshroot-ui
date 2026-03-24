"use client";

import { useState, useEffect, useCallback } from "react";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import {
	useVegetablePrices,
	useSetVegetablePrices,
} from "@/hooks/useAdminMutations";
import { useVegetables } from "@/hooks/useVegetables";
import { useToast } from "@/components/Toast";

/* -- Helpers ------------------------------------------------------ */

function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

/* -- Component ---------------------------------------------------- */

export default function PricingForm() {
	const [date, setDate] = useState(todayISO);
	const {
		data: vegetables,
		isLoading: isLoadingVeg,
		isError: isErrorVeg,
	} = useVegetables();
	const { data: existingPrices, isLoading: isLoadingPrices } =
		useVegetablePrices(date);
	const setPricesMut = useSetVegetablePrices();
	const { toast } = useToast();

	// Local price state: { [vegetableId]: price string }
	const [prices, setPricesLocal] = useState<Record<number, string>>({});
	const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());

	// Merge existing prices into local state when data loads
	useEffect(() => {
		if (!vegetables) return;

		// Build a price lookup from the API response (handles both `id` and `vegetableId` keys)
		const priceLookup: Record<number, number> = {};
		if (existingPrices) {
			for (const p of existingPrices) {
				const vegId = p.vegetableId ?? (p as unknown as { id: number }).id;
				if (vegId != null && p.price != null) {
					priceLookup[vegId] = p.price;
				}
			}
		}

		const map: Record<number, string> = {};
		for (const v of vegetables) {
			map[v.id] = priceLookup[v.id] != null ? String(priceLookup[v.id]) : "";
		}
		setPricesLocal(map);
	}, [vegetables, existingPrices]);

	const handlePriceChange = useCallback((vegId: number, value: string) => {
		setPricesLocal((prev) => ({ ...prev, [vegId]: value }));
	}, []);

	/* -- Validation ----------------------------------------------- */

	function isValid(): boolean {
		if (!vegetables?.length) return false;
		return vegetables.every((v) => {
			const val = Number(prices[v.id]);
			return !isNaN(val) && val > 0;
		});
	}

	/* -- Submit ---------------------------------------------------- */

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!vegetables?.length) return;

		const payload = {
			date,
			prices: vegetables.map((v) => ({
				vegetableId: v.id,
				price: Number(prices[v.id]),
			})),
		};

		setPricesMut.mutate(payload, {
			onSuccess: () => {
				toast("Prices saved successfully", "success");
				const ids = new Set(vegetables.map((v) => v.id));
				setHighlightedIds(ids);
				setTimeout(() => setHighlightedIds(new Set()), 2000);
			},
			onError: (err) =>
				toast(
					err instanceof Error ? err.message : "Failed to save prices",
					"error",
				),
		});
	}

	const isLoading = isLoadingVeg || isLoadingPrices;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between flex-wrap gap-3">
					<CardTitle>Set Vegetable Prices</CardTitle>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
					/>
				</div>
			</CardHeader>

			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-gray-400">Loading vegetables…</span>
				</div>
			)}

			{isErrorVeg && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-red-500">
						Failed to load vegetable list.
					</span>
				</div>
			)}

			{!isLoading && !isErrorVeg && vegetables && (
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* -- Table header ------------------------------------ */}
					<div className="grid grid-cols-[1fr_auto] gap-4 px-2 pb-1 border-b border-gray-200">
						<span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
							Vegetable
						</span>
						<span className="text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
							Price (₹/kg)
						</span>
					</div>

					{/* -- Rows -------------------------------------------- */}
					<div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
						{vegetables.map((veg) => {
							const highlighted = highlightedIds.has(veg.id);
							return (
								<div
									key={veg.id}
									className={`grid grid-cols-[1fr_auto] items-center gap-4 py-3 px-2 rounded-lg transition-colors ${
										highlighted ? "bg-green-50 ring-1 ring-green-200" : ""
									}`}
								>
									<div className="flex flex-col">
										<span className="text-sm font-medium text-gray-900">
											{veg.name}
										</span>
										{veg.hindiName && (
											<span className="text-xs text-gray-400">
												{veg.hindiName}
											</span>
										)}
									</div>
									<div className="flex items-center gap-1.5">
										<span className="text-sm text-gray-500">₹</span>
										<input
											type="number"
											min="0.01"
											step="0.01"
											value={prices[veg.id] ?? ""}
											onChange={(e) =>
												handlePriceChange(veg.id, e.target.value)
											}
											placeholder="0.00"
											className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-right focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
											required
										/>
									</div>
								</div>
							);
						})}
					</div>

					{vegetables.length === 0 && (
						<p className="py-4 text-center text-sm text-gray-400">
							No vegetables available.
						</p>
					)}

					{vegetables.length > 0 && (
						<button
							type="submit"
							disabled={setPricesMut.isPending || !isValid()}
							className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
						>
							{setPricesMut.isPending ? "Saving…" : "Save Prices"}
						</button>
					)}
				</form>
			)}
		</Card>
	);
}
