"use client";

import { useState, useRef, type FormEvent } from "react";
import { Select, Textarea } from "@/components/FormFields";
import Button from "@/components/Button";
import type { DashboardDelivery } from "@/utils/types";
import type { CreateTicketPayload } from "@/services/support.service";

const ISSUE_TYPES = [
	{ value: "missing-item", label: "Missing Item" },
	{ value: "late-delivery", label: "Late Delivery" },
	{ value: "quality-issue", label: "Quality Issue" },
];

interface SupportFormProps {
	deliveries: DashboardDelivery[];
	onSubmit: (data: CreateTicketPayload) => void;
	isSubmitting?: boolean;
}

export default function SupportForm({
	deliveries,
	onSubmit,
	isSubmitting,
}: SupportFormProps) {
	const [issueType, setIssueType] = useState("");
	const [deliveryId, setDeliveryId] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const fileRef = useRef<HTMLInputElement>(null);

	const deliveryOptions = deliveries.map((d) => ({
		value: d.id,
		label: `${new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — ${Array.isArray(d.items) ? d.items.join(", ") : d.items}`,
	}));

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (!issueType) e.issueType = "Select an issue type";
		if (!deliveryId) e.deliveryId = "Select a delivery";
		if (!description.trim()) e.description = "Describe the issue";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
		const f = ev.target.files?.[0] ?? null;
		setImage(f);
		if (f) {
			const reader = new FileReader();
			reader.onload = () => setPreview(reader.result as string);
			reader.readAsDataURL(f);
		} else {
			setPreview(null);
		}
	}

	function clearFile() {
		setImage(null);
		setPreview(null);
		if (fileRef.current) fileRef.current.value = "";
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit({
			issueType,
			deliveryId,
			description,
			image: image ?? undefined,
		});
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Select
					label="Issue Type *"
					id="support-issue-type"
					options={ISSUE_TYPES}
					value={issueType}
					onChange={(e) => {
						setIssueType(e.target.value);
						setErrors((p) => {
							const n = { ...p };
							delete n.issueType;
							return n;
						});
					}}
				/>
				{errors.issueType && (
					<p className="mt-1 text-xs text-red-600">{errors.issueType}</p>
				)}
			</div>

			<div>
				<Select
					label="Delivery *"
					id="support-delivery"
					options={deliveryOptions}
					value={deliveryId}
					onChange={(e) => {
						setDeliveryId(e.target.value);
						setErrors((p) => {
							const n = { ...p };
							delete n.deliveryId;
							return n;
						});
					}}
				/>
				{errors.deliveryId && (
					<p className="mt-1 text-xs text-red-600">{errors.deliveryId}</p>
				)}
			</div>

			<div>
				<Textarea
					label="Description *"
					id="support-description"
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
						setErrors((p) => {
							const n = { ...p };
							delete n.description;
							return n;
						});
					}}
					placeholder="Tell us what happened…"
				/>
				{errors.description && (
					<p className="mt-1 text-xs text-red-600">{errors.description}</p>
				)}
			</div>

			{/* Image upload with preview */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					Upload Image (optional)
				</label>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100 transition"
				/>
				{preview && (
					<div className="relative mt-2 inline-block">
						<img
							src={preview}
							alt="Preview"
							className="h-28 w-auto rounded-lg border border-gray-200 object-cover"
						/>
						<button
							type="button"
							onClick={clearFile}
							className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600"
						>
							✕
						</button>
					</div>
				)}
			</div>

			<div className="flex justify-end pt-2">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Submitting…" : "Report Issue"}
				</Button>
			</div>
		</form>
	);
}
