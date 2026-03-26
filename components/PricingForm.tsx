"use client";

import { useState, useEffect, useCallback } from "react";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import VegetablePriceInput from "@/components/VegetablePriceInput";
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
	// Original prices from API (to detect changes)
	const [originalPrices, setOriginalPrices] = useState<Record<number, string>>(
		{},
	);
	const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());
	// Track whether user has touched any field since last load
	const [dirty, setDirty] = useState(false);

	// Merge existing prices into local state when data loads (only if not dirty)
	useEffect(() => {
		if (!vegetables) return;
		if (dirty) return; // Don't overwrite user edits

		// Build a price lookup from the API response
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
		setOriginalPrices(map);
	}, [vegetables, existingPrices, dirty]);

	// Reset dirty flag when date changes
	useEffect(() => {
		setDirty(false);
	}, [date]);

	const handlePriceChange = useCallback((vegId: number, value: string) => {
		setPricesLocal((prev) => ({ ...prev, [vegId]: value }));
		setDirty(true);
	}, []);

	/* -- Derived state -------------------------------------------- */

	// Vegetables with a non-empty, valid (> 0) price — these get sent to API
	const submittablePrices = vegetables
		? vegetables.filter((v) => {
				const val = prices[v.id];
				if (!val || val.trim() === "") return false;
				const num = Number(val);
				return !isNaN(num) && num > 0;
			})
		: [];

	const hasInvalidPrice = vegetables
		? vegetables.some((v) => {
				const val = prices[v.id];
				if (!val || val.trim() === "") return false; // empty is OK
				const num = Number(val);
				return isNaN(num) || num < 0;
			})
		: false;

	// Enable button when user has made changes and there are no invalid values
	const canSubmit = dirty && !hasInvalidPrice;

	/* -- Submit ---------------------------------------------------- */

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;

		if (submittablePrices.length === 0) {
			toast("Enter a price greater than 0 for at least one vegetable", "error");
			return;
		}

		const payload = {
			date,
			prices: submittablePrices.map((v) => ({
				vegetableId: v.id,
				price: Number(prices[v.id]),
			})),
		};

		setPricesMut.mutate(payload, {
			onSuccess: () => {
				toast(
					`Prices saved for ${submittablePrices.length} vegetable${submittablePrices.length > 1 ? "s" : ""}`,
					"success",
				);
				setDirty(false); // allow refetched data to load in
				const ids = new Set(submittablePrices.map((v) => v.id));
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
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex items-center gap-2">
						<span className="text-lg">🌿</span>
						<CardTitle>Set Prices</CardTitle>
					</div>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs focus:border-green-500 focus:ring-1 focus:ring-green-200 outline-none"
					/>
				</div>
			</CardHeader>

			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<span className="text-sm text-gray-400">Loading vegetables...</span>
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
				<form onSubmit={handleSubmit} className="flex flex-col">
					{/* Column header */}
					<div className="sticky top-0 z-[1] grid grid-cols-[1fr_auto] gap-4 px-4 py-2 border-b border-gray-200 bg-white">
						<span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
							Vegetable
						</span>
						<span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 text-right">
							₹/kg
						</span>
					</div>

					{/* Scrollable rows */}
					<div className="overflow-y-auto flex-1 divide-y divide-gray-100">
						{vegetables.map((veg) => (
							<VegetablePriceInput
								key={veg.id}
								vegId={veg.id}
								name={veg.name}
								hindiName={veg.hindiName}
								value={prices[veg.id] ?? ""}
								originalValue={originalPrices[veg.id] ?? ""}
								onChange={handlePriceChange}
								highlighted={highlightedIds.has(veg.id)}
							/>
						))}
					</div>

					{vegetables.length === 0 && (
						<p className="py-4 text-center text-sm text-gray-400">
							No vegetables available.
						</p>
					)}

					{/* Sticky save footer */}
					{vegetables.length > 0 && (
						<div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
							<span className="text-[11px] text-gray-400">
								{submittablePrices.length > 0
									? `${submittablePrices.length}/${vegetables.length} priced`
									: "Enter at least one price"}
							</span>
							<button
								type="submit"
								disabled={setPricesMut.isPending || !canSubmit}
								className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
							>
								{setPricesMut.isPending ? "Saving…" : "Save Prices"}
							</button>
						</div>
					)}
				</form>
			)}
		</Card>
	);
}
