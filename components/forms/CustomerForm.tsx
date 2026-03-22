"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/FormFields";
import Button from "@/components/Button";
import type { CustomerFormData } from "@/utils/types";

interface CustomerFormProps {
	/** Pre-fill for editing */
	initial?: Partial<CustomerFormData> & { id?: string };
	/** Called on successful submit */
	onSubmit: (data: CustomerFormData, id?: string) => void;
	/** Disable while saving */
	isSubmitting?: boolean;
}

const empty: CustomerFormData = { name: "", phone: "", email: "", address: "" };

export default function CustomerForm({
	initial,
	onSubmit,
	isSubmitting,
}: CustomerFormProps) {
	const [form, setForm] = useState<CustomerFormData>({
		...empty,
		...initial,
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof CustomerFormData, string>>
	>({});

	const isEdit = Boolean(initial?.id);

	function validate(): boolean {
		const e: typeof errors = {};
		if (!form.name.trim()) e.name = "Name is required";
		if (!form.phone.trim()) e.phone = "Phone is required";
		else if (!/^\d{10,}$/.test(form.phone.replace(/\s/g, "")))
			e.phone = "Enter a valid phone number";
		if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
			e.email = "Enter a valid email";
		if (!form.address.trim()) e.address = "Address is required";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit(form, initial?.id);
	}

	function set(field: keyof CustomerFormData, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
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

			<div className="flex justify-end pt-2">
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
