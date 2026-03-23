"use client";

import { Input, Select } from "@/components/FormFields";
import type { SubscriptionFormData } from "@/utils/types";

const TYPE_OPTIONS = [
	{ value: "STF", label: "Soil to Fork (STF)" },
	{ value: "KG", label: "Kitchen Garden (KG)" },
];

const STF_PACKAGES = [
	{ value: "Pax 1 Monthly", label: "Pax 1 — Monthly" },
	{ value: "Pax 1 Quarterly", label: "Pax 1 — Quarterly" },
	{ value: "Pax 1 Half-Yearly", label: "Pax 1 — Half-Yearly" },
	{ value: "Pax 1 Yearly", label: "Pax 1 — Yearly" },
	{ value: "Pax 2-3 Monthly", label: "Pax 2–3 — Monthly" },
	{ value: "Pax 2-3 Quarterly", label: "Pax 2–3 — Quarterly" },
	{ value: "Pax 2-3 Half-Yearly", label: "Pax 2–3 — Half-Yearly" },
	{ value: "Pax 2-3 Yearly", label: "Pax 2–3 — Yearly" },
	{ value: "Pax 4-5 Monthly", label: "Pax 4–5 — Monthly" },
	{ value: "Pax 4-5 Quarterly", label: "Pax 4–5 — Quarterly" },
	{ value: "Pax 4-5 Half-Yearly", label: "Pax 4–5 — Half-Yearly" },
	{ value: "Pax 4-5 Yearly", label: "Pax 4–5 — Yearly" },
];

const KG_PACKAGES = [
	{ value: "Grow Bag 30", label: "Grow Bag — 30 Bags" },
	{ value: "Grow Bag 50", label: "Grow Bag — 50 Bags" },
	{ value: "Grow Bag 100", label: "Grow Bag — 100 Bags" },
	{ value: "Land 200 SqFt", label: "Land Area — 200 Sq. Ft." },
	{ value: "Land 500 SqFt", label: "Land Area — 500 Sq. Ft." },
	{ value: "Land 1000 SqFt", label: "Land Area — 1000 Sq. Ft." },
];

const STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

interface SubscriptionFormProps {
	data: SubscriptionFormData;
	onChange: (data: SubscriptionFormData) => void;
	errors?: Partial<Record<keyof SubscriptionFormData, string>>;
}

export default function SubscriptionForm({
	data,
	onChange,
	errors = {},
}: SubscriptionFormProps) {
	function set<K extends keyof SubscriptionFormData>(
		field: K,
		value: SubscriptionFormData[K],
	) {
		onChange({ ...data, [field]: value });
	}

	const packageOptions =
		data.type === "STF" ? STF_PACKAGES : data.type === "KG" ? KG_PACKAGES : [];

	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Select
						label="Plan Type *"
						id="sub-type"
						options={TYPE_OPTIONS}
						value={data.type}
						onChange={(e) =>
							set("type", e.target.value as SubscriptionFormData["type"])
						}
					/>
					{errors.type && (
						<p className="mt-1 text-xs text-red-600">{errors.type}</p>
					)}
				</div>

				<div>
					<Select
						label="Package *"
						id="sub-package"
						options={packageOptions}
						value={data.package}
						onChange={(e) => set("package", e.target.value)}
						disabled={!data.type}
					/>
					{errors.package && (
						<p className="mt-1 text-xs text-red-600">{errors.package}</p>
					)}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Input
						label="Actual Price (₹) *"
						id="sub-actual-price"
						type="number"
						min={0}
						value={data.actualPrice}
						onChange={(e) =>
							set(
								"actualPrice",
								e.target.value === "" ? "" : Number(e.target.value),
							)
						}
						placeholder="e.g. 16000"
					/>
					{errors.actualPrice && (
						<p className="mt-1 text-xs text-red-600">{errors.actualPrice}</p>
					)}
				</div>

				<div>
					<Input
						label="Offer Price (₹)"
						id="sub-offer-price"
						type="number"
						min={0}
						value={data.offerPrice}
						onChange={(e) =>
							set(
								"offerPrice",
								e.target.value === "" ? "" : Number(e.target.value),
							)
						}
						placeholder="e.g. 14000"
					/>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Input
						label="Payment Terms"
						id="sub-payment-terms"
						value={data.paymentTerms}
						onChange={(e) => set("paymentTerms", e.target.value)}
						placeholder="e.g. 50% advance"
					/>
				</div>

				<div>
					<Input
						label="Start Date *"
						id="sub-start-date"
						type="date"
						value={data.startDate}
						onChange={(e) => set("startDate", e.target.value)}
					/>
					{errors.startDate && (
						<p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
					)}
				</div>
			</div>

			<div className="sm:w-1/2">
				<Select
					label="Status"
					id="sub-status"
					options={STATUS_OPTIONS}
					value={data.status}
					onChange={(e) =>
						set("status", e.target.value as "active" | "inactive")
					}
				/>
			</div>
		</div>
	);
}
