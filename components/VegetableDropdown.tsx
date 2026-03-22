"use client";

import { useState, useRef, useEffect } from "react";
import type { Vegetable } from "@/services/vegetable.service";
import { cn } from "@/utils/cn";

const CATEGORY_ORDER = ["seasonal", "staple", "exotic"];
const CATEGORY_LABELS: Record<string, string> = {
	seasonal: "🌿 Seasonal",
	staple: "🥬 Staple",
	exotic: "✨ Exotic",
};

interface VegetableDropdownProps {
	vegetables: Vegetable[];
	value: number | null; // vegetable id
	onChange: (veg: Vegetable) => void;
	/** IDs already selected in other rows — used to prevent duplicates */
	excludeIds?: number[];
	id?: string;
	isLoading?: boolean;
}

export default function VegetableDropdown({
	vegetables,
	value,
	onChange,
	excludeIds = [],
	id,
	isLoading,
}: VegetableDropdownProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const selected = vegetables.find((v) => v.id === value);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handler(ev: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(ev.target as Node)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Filter
	const q = search.toLowerCase();
	const filtered = vegetables.filter((v) => {
		if (excludeIds.includes(v.id) && v.id !== value) return false;
		if (!q) return true;
		return (
			v.name.toLowerCase().includes(q) ||
			v.hindiName.toLowerCase().includes(q) ||
			v.category.toLowerCase().includes(q)
		);
	});

	// Group by category (normalize to lowercase for matching)
	const grouped = CATEGORY_ORDER.map((cat) => ({
		category: cat,
		label: CATEGORY_LABELS[cat],
		items: filtered.filter((v) => v.category.toLowerCase() === cat),
	})).filter((g) => g.items.length > 0);

	function handleSelect(veg: Vegetable) {
		onChange(veg);
		setSearch("");
		setOpen(false);
	}

	if (isLoading) {
		return (
			<div className="space-y-1">
				<label className="block text-sm font-medium text-gray-700">
					Vegetable
				</label>
				<div className="h-[38px] animate-pulse rounded-lg bg-gray-100" />
			</div>
		);
	}

	return (
		<div ref={containerRef} className="relative space-y-1">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				Vegetable
			</label>

			{/* Trigger */}
			<button
				type="button"
				id={id}
				onClick={() => {
					setOpen((p) => !p);
					setTimeout(() => inputRef.current?.focus(), 0);
				}}
				className={cn(
					"flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition",
					open
						? "border-green-500 ring-2 ring-green-200"
						: "border-gray-300 hover:border-gray-400",
					!selected && "text-gray-400",
				)}
			>
				<span className={selected ? "text-gray-900" : undefined}>
					{selected
						? `${selected.name} (${selected.hindiName})`
						: "Select vegetable…"}
				</span>
				<span className="text-gray-400">{open ? "▲" : "▼"}</span>
			</button>

			{/* Dropdown */}
			{open && (
				<div className="mt-1 mb-8 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
					{/* Search */}
					<div className="border-b border-gray-100 p-2">
						<input
							ref={inputRef}
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search vegetables…"
							className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
						/>
					</div>

					{/* List */}
					<div className="max-h-56 overflow-y-auto">
						{grouped.length === 0 && (
							<p className="px-3 py-4 text-center text-sm text-gray-400">
								{vegetables.length === 0
									? "No vegetables available"
									: "No results found"}
							</p>
						)}

						{grouped.map((group) => (
							<div key={group.category}>
								<p className="sticky top-0 z-10 bg-gray-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
									{group.label}
								</p>
								{group.items.map((veg) => {
									const isSelected = veg.id === value;
									const isDuplicate =
										excludeIds.includes(veg.id) && !isSelected;
									return (
										<button
											key={veg.id}
											type="button"
											disabled={isDuplicate}
											onClick={() => handleSelect(veg)}
											className={cn(
												"flex w-full items-center justify-between px-3 py-2 text-left text-sm transition",
												isSelected
													? "bg-green-50 text-green-700 font-medium"
													: isDuplicate
														? "cursor-not-allowed text-gray-300"
														: "hover:bg-gray-50 text-gray-700",
											)}
										>
											<span>
												{veg.name}{" "}
												<span className="text-gray-400">({veg.hindiName})</span>
											</span>
											<span className="text-xs text-gray-400">{veg.unit}</span>
										</button>
									);
								})}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
