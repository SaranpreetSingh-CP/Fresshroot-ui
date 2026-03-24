"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/FormFields";
import Button from "@/components/Button";
import SubscriptionForm from "@/components/forms/SubscriptionForm";
import type { CustomerFormData, SubscriptionFormData } from "@/utils/types";

interface CustomerFormProps {
	/** Pre-fill for editing */
	initial?: Partial<CustomerFormData> & { id?: string };
	/** Called on successful submit */
	onSubmit: (data: CustomerFormData, id?: string) => void;
	/** Disable while saving */
	isSubmitting?: boolean;
}

const emptyCustomer: Omit<CustomerFormData, "subscription"> = {
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

export default function CustomerForm({
	initial,
	onSubmit,
	isSubmitting,
}: CustomerFormProps) {
	const [form, setForm] = useState<Omit<CustomerFormData, "subscription">>({
		...emptyCustomer,
		name: initial?.name ?? "",
		phone: initial?.phone ?? "",
		email: initial?.email ?? "",
		address: initial?.address ?? "",
	});

	const [showPlan, setShowPlan] = useState(Boolean(initial?.subscription));
	const [sub, setSub] = useState<SubscriptionFormData>({
		...emptySub,
		...initial?.subscription,
	});

	const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

	const isEdit = Boolean(initial?.id);

	function validate(): boolean {
		const e: Record<string, string> = {};

		// Customer validation
		if (!form.name.trim()) e.name = "Name is required";
		if (!form.phone.trim()) e.phone = "Phone is required";
		else if (!/^\d{10,}$/.test(form.phone.replace(/\s/g, "")))
			e.phone = "Enter a valid phone number";
		if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
			e.email = "Enter a valid email";
		if (!form.address.trim()) e.address = "Address is required";

		// Subscription validation (only if enabled)
		if (showPlan) {
			if (!sub.type) e["sub.type"] = "Select a plan type";
			if (!sub.package) e["sub.package"] = "Select a package";
			if (sub.actualPrice === "" || sub.actualPrice <= 0)
				e["sub.actualPrice"] = "Enter a valid price";
			if (!sub.startDate) e["sub.startDate"] = "Select a start date";
		}

		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;

		const payload: CustomerFormData = {
			...form,
			...(showPlan
				? {
						subscription: {
							...sub,
							type: sub.type as "STF" | "KG",
						},
					}
				: {}),
		};

		onSubmit(payload, initial?.id);
	}

	function set(field: keyof typeof form, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	}

	function handleSubChange(updated: SubscriptionFormData) {
		setSub(updated);
		// Clear related errors
		setErrors((prev) => {
			const next = { ...prev };
			delete next["sub.type"];
			delete next["sub.package"];
			delete next["sub.actualPrice"];
			delete next["sub.startDate"];
			return next;
		});
	}

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

			{/* -- Section: Plan Details (toggle) --------------------- */}
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
						{showPlan ? "Plan Details" : "Add Plan (optional)"}
					</span>
				</label>

				{showPlan && (
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
