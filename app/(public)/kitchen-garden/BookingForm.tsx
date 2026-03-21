"use client";

import { useState } from "react";
import { useBookingStore } from "@/store";
import { submitBooking } from "@/services/api";
import { GARDEN_PACKAGES } from "@/utils/mock-data";
import { Input, Textarea, Select } from "@/components/FormFields";
import Button from "@/components/Button";

export default function BookingForm() {
	const { formData, setField, resetForm } = useBookingStore();
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const packageOptions = GARDEN_PACKAGES.map((p) => ({
		value: p.id,
		label: `${p.name} — ₹${p.price.toLocaleString("en-IN")}`,
	}));

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);
		try {
			const res = await submitBooking(formData);
			setMessage(res.message);
			resetForm();
		} catch {
			setMessage("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid gap-5 sm:grid-cols-2">
				<Input
					label="Full Name"
					id="name"
					required
					placeholder="Jane Doe"
					value={formData.name}
					onChange={(e) => setField("name", e.target.value)}
				/>
				<Input
					label="Email"
					id="email"
					type="email"
					required
					placeholder="jane@example.com"
					value={formData.email}
					onChange={(e) => setField("email", e.target.value)}
				/>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<Input
					label="Phone"
					id="phone"
					type="tel"
					required
					placeholder="+91 98765 43210"
					value={formData.phone}
					onChange={(e) => setField("phone", e.target.value)}
				/>
				<Input
					label="Preferred Date"
					id="preferredDate"
					type="date"
					required
					value={formData.preferredDate}
					onChange={(e) => setField("preferredDate", e.target.value)}
				/>
			</div>

			<Select
				label="Garden Package"
				id="packageId"
				required
				options={packageOptions}
				value={formData.packageId}
				onChange={(e) => setField("packageId", e.target.value)}
			/>

			<Input
				label="Address"
				id="address"
				required
				placeholder="Your full address"
				value={formData.address}
				onChange={(e) => setField("address", e.target.value)}
			/>

			<Textarea
				label="Additional Message (optional)"
				id="message"
				placeholder="Tell us about your space, preferences, etc."
				value={formData.message ?? ""}
				onChange={(e) => setField("message", e.target.value)}
			/>

			<Button type="submit" size="lg" className="w-full" disabled={submitting}>
				{submitting ? "Submitting…" : "Submit Booking Request"}
			</Button>

			{message && (
				<p className="text-center text-sm font-medium text-green-700">
					{message}
				</p>
			)}
		</form>
	);
}
