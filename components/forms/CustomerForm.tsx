"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/FormFields";
import Button from "@/components/Button";
import SubscriptionForm from "@/components/forms/SubscriptionForm";
import VegetableLimitRow from "@/components/VegetableLimitRow";
import { useVegetables } from "@/hooks/useVegetables";
import type {
	CustomerFormData,
	SubscriptionFormData,
	PlanFormData,
	VegetableLimitInput,
} from "@/utils/types";

interface CustomerFormProps {
	/** Pre-fill for editing */
	initial?: Partial<CustomerFormData> & { id?: string };
	/** Called on successful submit */
	onSubmit: (data: CustomerFormData, id?: string) => void;
	/** Disable while saving */
	isSubmitting?: boolean;
}

const emptyCustomer: Omit<CustomerFormData, "subscription" | "plan"> = {
	name: "",
	phone: "",
	email: "",
	address: "",
};

const emptySub: SubscriptionFormData = {
	type: "",
	package: "",
	actualPrice: "",
	offerPrice: "",
	paymentTerms: "",
	startDate: "",
	status: "active",
};

const emptyPlan: PlanFormData = {
	totalQty: "",
	limits: [],
};

const emptyLimit: VegetableLimitInput = {
	vegetableId: 0,
	vegetableName: "",
	unit: "kg",
	maxQtyKg: "",
	maxQtyPiece: "",
};

export default function CustomerForm({
	initial,
	onSubmit,
	isSubmitting,
}: CustomerFormProps) {
	const { data: vegetables = [], isLoading: vegLoading } = useVegetables();

	const [form, setForm] = useState<
		Omit<CustomerFormData, "subscription" | "plan">
	>({
		...emptyCustomer,
		name: initial?.name ?? "",
		phone: initial?.phone ?? "",
		email: initial?.email ?? "",
		address: initial?.address ?? "",
	});

	const [showSub, setShowSub] = useState(Boolean(initial?.subscription));
	const [sub, setSub] = useState<SubscriptionFormData>({
		...emptySub,
		...initial?.subscription,
	});

	const [showPlan, setShowPlan] = useState(Boolean(initial?.plan));
	const [plan, setPlan] = useState<PlanFormData>({
		...emptyPlan,
		...initial?.plan,
	});

	const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

	const isEdit = Boolean(initial?.id);

	/* -- Validation ------------------------------------------------ */
	function validate(): boolean {
		const e: Record<string, string> = {};

		if (!form.name.trim()) e.name = "Name is required";
		if (!form.phone.trim()) e.phone = "Phone is required";
		else if (!/^\d{10,}$/.test(form.phone.replace(/\s/g, "")))
			e.phone = "Enter a valid phone number";
		if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
			e.email = "Enter a valid email";
		if (!form.address.trim()) e.address = "Address is required";

		if (showSub) {
			if (!sub.type) e["sub.type"] = "Select a plan type";
			if (!sub.package) e["sub.package"] = "Select a package";
			if (sub.actualPrice === "" || sub.actualPrice <= 0)
				e["sub.actualPrice"] = "Enter a valid price";
			if (!sub.startDate) e["sub.startDate"] = "Select a start date";
		}

		if (showPlan) {
			if (plan.totalQty === "" || Number(plan.totalQty) <= 0)
				e["plan.totalQty"] = "Enter total quantity (kg)";

			plan.limits.forEach((l, i) => {
				if (!l.vegetableId) e[`limit.${i}.veg`] = "Select a vegetable";
				if (
					(l.maxQtyKg === "" || l.maxQtyKg === undefined) &&
					(l.maxQtyPiece === "" || l.maxQtyPiece === undefined)
				)
					e[`limit.${i}.qty`] = "Enter a limit";
			});
		}

		setErrors(e);
		return Object.keys(e).length === 0;
	}

	/* -- Submit ---------------------------------------------------- */
	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;

		const payload: CustomerFormData = {
			...form,
			...(showSub
				? { subscription: { ...sub, type: sub.type as "STF" | "KG" } }
				: {}),
			...(showPlan
				? { plan: { ...plan, totalQty: Number(plan.totalQty) } }
				: {}),
		};

		onSubmit(payload, initial?.id);
	}

	/* -- Helpers --------------------------------------------------- */
	function set(field: keyof typeof form, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	}

	function handleSubChange(updated: SubscriptionFormData) {
		setSub(updated);
		setErrors((prev) => {
			const next = { ...prev };
			delete next["sub.type"];
			delete next["sub.package"];
			delete next["sub.actualPrice"];
			delete next["sub.startDate"];
			return next;
		});
	}

	function updateLimit(index: number, updated: VegetableLimitInput) {
		setPlan((prev) => ({
			...prev,
			limits: prev.limits.map((l, i) => (i === index ? updated : l)),
		}));
	}

	function removeLimit(index: number) {
		setPlan((prev) => ({
			...prev,
			limits: prev.limits.filter((_, i) => i !== index),
		}));
	}

	function addLimit() {
		setPlan((prev) => ({
			...prev,
			limits: [...prev.limits, { ...emptyLimit }],
		}));
	}

	const usedVegIds = plan.limits
		.map((l) => l.vegetableId)
		.filter((id): id is number => !!id);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* -- Section: Customer Details --------------------------- */}
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
			</fieldset>

			{/* -- Section: Subscription (toggle) --------------------- */}
			<div className="border-t border-gray-100 pt-4">
				<label className="flex cursor-pointer items-center gap-3">
					<div className="relative">
						<input
							type="checkbox"
							className="peer sr-only"
							checked={showSub}
							onChange={(e) => setShowSub(e.target.checked)}
						/>
						<div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-green-600" />
						<div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
					</div>
					<span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
						{showSub ? "Subscription Details" : "Add Subscription (optional)"}
					</span>
				</label>

				{showSub && (
					<div className="mt-4">
						<SubscriptionForm
							data={sub}
							onChange={handleSubChange}
							errors={{
								type: errors["sub.type"],
								package: errors["sub.package"],
								actualPrice: errors["sub.actualPrice"],
								startDate: errors["sub.startDate"],
							}}
						/>
					</div>
				)}
			</div>

			{/* -- Section: Plan & Vegetable Limits (toggle) ---------- */}
			<div className="border-t border-gray-100 pt-4">
				<label className="flex cursor-pointer items-center gap-3">
					<div className="relative">
						<input
							type="checkbox"
							className="peer sr-only"
							checked={showPlan}
							onChange={(e) => setShowPlan(e.target.checked)}
						/>
						<div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-green-600" />
						<div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
					</div>
					<span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
						{showPlan ? "Plan & Limits" : "Add Plan & Limits (optional)"}
					</span>
				</label>

				{showPlan && (
					<div className="mt-4 space-y-5">
						{/* Total Qty */}
						<div className="max-w-xs">
							<Input
								label="Total Quantity (kg) *"
								id="plan-totalQty"
								type="number"
								min={1}
								step={1}
								value={plan.totalQty}
								onChange={(e) =>
									setPlan((prev) => ({
										...prev,
										totalQty:
											e.target.value === "" ? "" : Number(e.target.value),
									}))
								}
								placeholder="e.g. 72"
							/>
							{errors["plan.totalQty"] && (
								<p className="mt-1 text-xs text-red-600">
									{errors["plan.totalQty"]}
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

							{plan.limits.length === 0 && (
								<p className="text-xs text-gray-400">
									No per-vegetable limits — all vegetables unrestricted.
								</p>
							)}

							{plan.limits.map((limit, i) => (
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

			{/* -- Submit --------------------------------------------- */}
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
