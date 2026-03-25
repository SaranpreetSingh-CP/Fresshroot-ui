"use client";

import { useState } from "react";
import { Input, Textarea, Select } from "@/components/FormFields";
import Button from "@/components/Button";
import { useCreateLead } from "@/hooks/useLeads";
import { useToast } from "@/components/Toast";
import type { LeadFormData } from "@/utils/types";

const WHATSAPP_NUMBER = "+917982044126"; // replace with real number

const PLAN_OPTIONS = [
	{ value: "grow-bag", label: "Grow Bag Package" },
	{ value: "land-area", label: "Land Area Package" },
];

const AREA_OPTIONS = [
	{ value: "200", label: "200 Sq. Ft." },
	{ value: "500", label: "500 Sq. Ft." },
	{ value: "1000", label: "1000 Sq. Ft." },
	{ value: "30-bags", label: "30 Grow Bags" },
	{ value: "50-bags", label: "50 Grow Bags" },
	{ value: "100-bags", label: "100 Grow Bags" },
	{ value: "custom", label: "Custom / Other" },
];

interface QuoteFormProps {
	/** Called after a successful submit (e.g. to close a modal) */
	onSuccess?: () => void;
}

export default function QuoteForm({ onSuccess }: QuoteFormProps) {
	const [form, setForm] = useState<LeadFormData>({
		name: "",
		phone: "",
		email: "",
		areaSize: "",
		planType: "",
		message: "",
	});

	const createLead = useCreateLead();
	const { toast } = useToast();

	function update<K extends keyof LeadFormData>(
		key: K,
		value: LeadFormData[K],
	) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	const canSubmit = form.name.trim() !== "" && form.phone.trim() !== "";

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;

		createLead.mutate(form, {
			onSuccess: () => {
				toast(
					"Quote request submitted! We'll get back to you soon.",
					"success",
				);

				// Reset form
				setForm({
					name: "",
					phone: "",
					email: "",
					areaSize: "",
					planType: "",
					message: "",
				});

				// WhatsApp redirect
				const waText = encodeURIComponent(
					`Hi, I just requested a kitchen garden quote.\nName: ${form.name}\nPhone: ${form.phone}${form.planType ? `\nPlan: ${form.planType}` : ""}`,
				);
				window.open(
					`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`,
					"_blank",
				);

				onSuccess?.();
			},
			onError: (err) => {
				toast(
					err instanceof Error
						? err.message
						: "Failed to submit. Please try again.",
					"error",
				);
			},
		});
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid gap-5 sm:grid-cols-2">
				<Input
					label="Name"
					id="quote-name"
					required
					placeholder="Your full name"
					value={form.name}
					onChange={(e) => update("name", e.target.value)}
				/>
				<Input
					label="Phone"
					id="quote-phone"
					type="tel"
					required
					placeholder="+91 98765 43210"
					value={form.phone}
					onChange={(e) => update("phone", e.target.value)}
				/>
			</div>

			<Input
				label="Email"
				id="quote-email"
				type="email"
				placeholder="jane@example.com (optional)"
				value={form.email}
				onChange={(e) => update("email", e.target.value)}
			/>

			<div className="grid gap-5 sm:grid-cols-2">
				<Select
					label="Plan Type"
					id="quote-plan"
					options={PLAN_OPTIONS}
					value={form.planType}
					onChange={(e) => update("planType", e.target.value)}
				/>
				<Select
					label="Area Size"
					id="quote-area"
					options={AREA_OPTIONS}
					value={form.areaSize}
					onChange={(e) => update("areaSize", e.target.value)}
				/>
			</div>

			<Textarea
				label="Message (optional)"
				id="quote-message"
				rows={3}
				placeholder="Tell us about your space, preferences, etc."
				value={form.message}
				onChange={(e) => update("message", e.target.value)}
			/>

			<Button
				type="submit"
				size="lg"
				className="w-full"
				disabled={!canSubmit || createLead.isPending}
			>
				{createLead.isPending ? (
					<span className="flex items-center justify-center gap-2">
						<svg
							className="h-4 w-4 animate-spin"
							viewBox="0 0 24 24"
							fill="none"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						Submitting…
					</span>
				) : (
					"Get Quote"
				)}
			</Button>
		</form>
	);
}
