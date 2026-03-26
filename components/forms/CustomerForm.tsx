"use client";

import { useState, type FormEvent } from "react";
import { Input, Select } from "@/components/FormFields";
import Button from "@/components/Button";
import SubscriptionForm from "@/components/forms/SubscriptionForm";
import VegetableLimitRow from "@/components/VegetableLimitRow";
import { useVegetables } from "@/hooks/useVegetables";
import type {
	CustomerFormData,
	SubscriptionFormData,
	VegetableLimitInput,
} from "@/utils/types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface CustomerFormProps {
	/** Pre-fill for editing — flat CustomerFormData + optional id */
	initial?: Partial<CustomerFormData> & { id?: string };
	/** Called on successful submit */
	onSubmit: (data: CustomerFormData, id?: string) => void;
	/** Disable while saving */
	isSubmitting?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */
const emptyForm: CustomerFormData = {
	name: "",
	phone: "",
	email: "",
	address: "",
	status: "active",

	hasSubscription: false,
	planType: "",
	packageName: "",
	actualPrice: "",
	offerPrice: "",
	paymentTerms: "",
	startDate: "",
	subscriptionStatus: "active",

	hasPlan: false,
	totalQtyKg: "",
	vegetableLimits: [],
};

const emptyLimit: VegetableLimitInput = {
	vegetableId: 0,
	vegetableName: "",
	unit: "kg",
	maxQty: "",
};

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */
export default function CustomerForm({
	initial,
	onSubmit,
	isSubmitting,
}: CustomerFormProps) {
	const { data: vegetables = [], isLoading: vegLoading } = useVegetables();

	const [form, setForm] = useState<CustomerFormData>(() => ({
		...emptyForm,
		...initial,
	}));

	const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

	const isEdit = Boolean(initial?.id);

	/* -- Field helpers --------------------------------------------- */
	function set<K extends keyof CustomerFormData>(
		field: K,
		value: CustomerFormData[K],
	) {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	}

	/* -- Subscription toggle --------------------------------------- */
	function toggleSubscription(on: boolean) {
		setForm((prev) => ({
			...prev,
			hasSubscription: on,
			// When turning off, also turn off plan
			...(!on ? { hasPlan: false } : {}),
		}));
	}

	/* -- Map flat state ↔ SubscriptionForm sub-component ---------- */
	function subFormData(): SubscriptionFormData {
		return {
			type: form.planType,
			package: form.packageName,
			actualPrice: form.actualPrice,
			offerPrice: form.offerPrice,
			paymentTerms: form.paymentTerms,
			startDate: form.startDate,
			status: form.subscriptionStatus,
		};
	}

	function handleSubChange(updated: SubscriptionFormData) {
		setForm((prev) => ({
			...prev,
			planType: updated.type,
			packageName: updated.package,
			actualPrice: updated.actualPrice,
			offerPrice: updated.offerPrice,
			paymentTerms: updated.paymentTerms,
			startDate: updated.startDate,
			subscriptionStatus: updated.status,
			// When plan type changes away from STF, turn off plan
			...(updated.type !== "STF" ? { hasPlan: false } : {}),
		}));
		setErrors((prev) => {
			const next = { ...prev };
			delete next.planType;
			delete next.packageName;
			delete next.actualPrice;
			delete next.startDate;
			return next;
		});
	}

	/* -- Vegetable limits helpers --------------------------------- */
	function updateLimit(index: number, updated: VegetableLimitInput) {
		setForm((prev) => ({
			...prev,
			vegetableLimits: prev.vegetableLimits.map((l, i) =>
				i === index ? updated : l,
			),
		}));
	}

	function removeLimit(index: number) {
		setForm((prev) => ({
			...prev,
			vegetableLimits: prev.vegetableLimits.filter((_, i) => i !== index),
		}));
	}

	function addLimit() {
		setForm((prev) => ({
			...prev,
			vegetableLimits: [...prev.vegetableLimits, { ...emptyLimit }],
		}));
	}

	const usedVegIds = form.vegetableLimits
		.map((l) => l.vegetableId)
		.filter((id): id is number => !!id);

	/* -- Validation ----------------------------------------------- */
	function validate(): boolean {
		const e: Record<string, string> = {};

		if (!form.name.trim()) e.name = "Name is required";
		if (!form.phone.trim()) e.phone = "Phone is required";
		else if (!/^\d{10,}$/.test(form.phone.replace(/\s/g, "")))
			e.phone = "Enter a valid phone number";
		if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
			e.email = "Enter a valid email";
		if (!form.address.trim()) e.address = "Address is required";

		if (form.hasSubscription) {
			if (!form.planType) e.planType = "Select a plan type";
			if (!form.packageName) e.packageName = "Select a package";
			if (form.actualPrice === "" || form.actualPrice <= 0)
				e.actualPrice = "Enter a valid price";
			if (!form.startDate) e.startDate = "Select a start date";
		}

		if (form.hasPlan) {
			if (form.totalQtyKg === "" || Number(form.totalQtyKg) <= 0)
				e.totalQtyKg = "Enter total quantity (kg)";

			form.vegetableLimits.forEach((l, i) => {
				if (!l.vegetableId) e[`limit.${i}.veg`] = "Select a vegetable";
				if (l.maxQty === "" || l.maxQty === undefined)
					e[`limit.${i}.qty`] = "Enter a limit";
			});
		}

		setErrors(e);
		return Object.keys(e).length === 0;
	}

	/* -- Submit --------------------------------------------------- */
	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit(form, initial?.id);
	}

	/* ============================================================== */
	/*  Render                                                         */
	/* ============================================================== */
	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* -- Section: Customer Details ------------------------------ */}
			<fieldset className="space-y-4">
				<legend className="text-sm font-semibold uppercase tracking-wide text-gray-500">
					Customer Details
				</legend>

				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<Input
							label="Name *"
							id="customer-name"
							value={form.name}
							onChange={(e) => set("name", e.target.value)}
							placeholder="Customer name"
						/>
						{errors.name && (
							<p className="mt-1 text-xs text-red-600">{errors.name}</p>
						)}
					</div>

					<div>
						<Input
							label="Phone *"
							id="customer-phone"
							value={form.phone}
							onChange={(e) => set("phone", e.target.value)}
							placeholder="9876543210"
						/>
						{errors.phone && (
							<p className="mt-1 text-xs text-red-600">{errors.phone}</p>
						)}
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<Input
							label="Email"
							id="customer-email"
							type="email"
							value={form.email}
							onChange={(e) => set("email", e.target.value)}
							placeholder="email@example.com"
						/>
						{errors.email && (
							<p className="mt-1 text-xs text-red-600">{errors.email}</p>
						)}
					</div>

					<div>
						<Input
							label="Address *"
							id="customer-address"
							value={form.address}
							onChange={(e) => set("address", e.target.value)}
							placeholder="Full address"
						/>
						{errors.address && (
							<p className="mt-1 text-xs text-red-600">{errors.address}</p>
						)}
					</div>
				</div>

				{/* Customer status */}
				<div className="sm:w-1/2">
					<Select
						label="Status"
						id="customer-status"
						value={form.status}
						onChange={(e) =>
							set("status", e.target.value as "active" | "inactive")
						}
						options={[
							{ value: "active", label: "Active" },
							{ value: "inactive", label: "Inactive" },
						]}
					/>
				</div>
			</fieldset>

			{/* -- Section: Subscription (toggle) ------------------------ */}
			<div className="border-t border-gray-100 pt-4">
				<label className="flex cursor-pointer items-center gap-3">
					<div className="relative">
						<input
							type="checkbox"
							className="peer sr-only"
							checked={form.hasSubscription}
							onChange={(e) => toggleSubscription(e.target.checked)}
						/>
						<div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-green-600" />
						<div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
					</div>
					<span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
						{form.hasSubscription
							? "Subscription Details"
							: "Add Subscription (optional)"}
					</span>
				</label>

				{form.hasSubscription && (
					<div className="mt-4">
						<SubscriptionForm
							data={subFormData()}
							onChange={handleSubChange}
							errors={{
								type: errors.planType,
								package: errors.packageName,
								actualPrice: errors.actualPrice,
								startDate: errors.startDate,
							}}
						/>
					</div>
				)}
			</div>

			{/* -- Section: Plan & Vegetable Limits (toggle, STF only) --- */}
			{form.hasSubscription && form.planType === "STF" && (
				<div className="border-t border-gray-100 pt-4">
					<label className="flex cursor-pointer items-center gap-3">
						<div className="relative">
							<input
								type="checkbox"
								className="peer sr-only"
								checked={form.hasPlan}
								onChange={(e) => set("hasPlan", e.target.checked)}
							/>
							<div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-green-600" />
							<div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
						</div>
						<span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
							{form.hasPlan ? "Plan & Limits" : "Add Plan & Limits (optional)"}
						</span>
					</label>

					{form.hasPlan && (
						<div className="mt-4 space-y-5">
							{/* Total Qty */}
							<div className="max-w-xs">
								<Input
									label="Total Quantity (kg) *"
									id="plan-totalQty"
									type="number"
									min={1}
									step={1}
									value={form.totalQtyKg}
									onChange={(e) =>
										set(
											"totalQtyKg",
											e.target.value === "" ? "" : Number(e.target.value),
										)
									}
									placeholder="e.g. 72"
								/>
								{errors.totalQtyKg && (
									<p className="mt-1 text-xs text-red-600">
										{errors.totalQtyKg}
									</p>
								)}
							</div>

							{/* Per-vegetable limits */}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
										Per-Vegetable Limits (optional)
									</p>
									<button
										type="button"
										onClick={addLimit}
										className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition"
									>
										+ Add Limit
									</button>
								</div>

								{form.vegetableLimits.length === 0 && (
									<p className="text-xs text-gray-400">
										No per-vegetable limits — all vegetables unrestricted.
									</p>
								)}

								{form.vegetableLimits.map((limit, i) => (
									<div key={i}>
										<VegetableLimitRow
											row={limit}
											index={i}
											vegetables={vegetables}
											excludeIds={usedVegIds.filter(
												(id) => id !== limit.vegetableId,
											)}
											isLoading={vegLoading}
											onChange={updateLimit}
											onRemove={removeLimit}
										/>
										{errors[`limit.${i}.veg`] && (
											<p className="mt-1 text-xs text-red-600">
												{errors[`limit.${i}.veg`]}
											</p>
										)}
										{errors[`limit.${i}.qty`] && (
											<p className="mt-1 text-xs text-red-600">
												{errors[`limit.${i}.qty`]}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* -- Submit ------------------------------------------------ */}
			<div className="flex justify-end border-t border-gray-100 pt-4">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? "Saving…"
						: isEdit
							? "Update Customer"
							: "Add Customer"}
				</Button>
			</div>
		</form>
	);
}
