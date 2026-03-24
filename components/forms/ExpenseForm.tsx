"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Input, Select } from "@/components/FormFields";
import Button from "@/components/Button";
import FilePreview from "@/components/FilePreview";
import type { ExpenseFormData, AdminExpense } from "@/utils/types";

interface ExpenseFormProps {
	onSubmit: (data: ExpenseFormData) => void;
	isSubmitting?: boolean;
	/** When provided the form pre-fills for editing */
	initial?: AdminExpense | null;
}

const CATEGORIES = [
	{ value: "transport", label: "Transport" },
	{ value: "labour", label: "Labour" },
	{ value: "packaging", label: "Packaging" },
	{ value: "seeds", label: "Seeds & Saplings" },
	{ value: "fertilizer", label: "Fertilizer" },
	{ value: "equipment", label: "Equipment" },
	{ value: "other", label: "Other" },
];

export default function ExpenseForm({
	onSubmit,
	isSubmitting,
	initial,
}: ExpenseFormProps) {
	const isEdit = !!initial;
	const hasBill = isEdit && !!initial?.billUrl;

	const [form, setForm] = useState({
		category: "",
		description: "",
		amount: "",
		date: new Date().toISOString().slice(0, 10),
	});
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const fileRef = useRef<HTMLInputElement>(null);

	/* Pre-fill when editing */
	useEffect(() => {
		if (initial) {
			setForm({
				category: initial.category ?? "",
				description: initial.description ?? "",
				amount: String(initial.amount ?? ""),
				date: initial.date
					? new Date(initial.date).toISOString().slice(0, 10)
					: new Date().toISOString().slice(0, 10),
			});
			setFile(null);
			setPreview(null);
			setErrors({});
			if (fileRef.current) fileRef.current.value = "";
		}
	}, [initial]);

	/* Generate local preview for selected images */
	useEffect(() => {
		if (!file) {
			setPreview(null);
			return;
		}
		if (!file.type.startsWith("image/")) {
			setPreview(null);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (!form.category) e.category = "Select a category";
		if (!form.description.trim()) e.description = "Description is required";
		if (!form.amount || Number(form.amount) <= 0)
			e.amount = "Enter a valid amount";
		if (!form.date) e.date = "Date is required";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault();
		if (!validate()) return;
		onSubmit({
			category: form.category,
			description: form.description,
			amount: Number(form.amount),
			date: form.date,
			file: file ?? undefined,
		});
	}

	function set(field: string, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0] ?? null;
		setFile(f);
	}

	function clearFile() {
		setFile(null);
		setPreview(null);
		if (fileRef.current) fileRef.current.value = "";
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Select
					label="Category *"
					id="expense-category"
					options={CATEGORIES}
					value={form.category}
					onChange={(e) => set("category", e.target.value)}
				/>
				{errors.category && (
					<p className="mt-1 text-xs text-red-600">{errors.category}</p>
				)}
			</div>

			<div>
				<Input
					label="Description *"
					id="expense-description"
					value={form.description}
					onChange={(e) => set("description", e.target.value)}
					placeholder="Describe the expense"
				/>
				{errors.description && (
					<p className="mt-1 text-xs text-red-600">{errors.description}</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Input
						label="Amount (₹) *"
						id="expense-amount"
						type="number"
						min={1}
						value={form.amount}
						onChange={(e) => set("amount", e.target.value)}
						placeholder="0"
					/>
					{errors.amount && (
						<p className="mt-1 text-xs text-red-600">{errors.amount}</p>
					)}
				</div>
				<div>
					<Input
						label="Date *"
						id="expense-date"
						type="date"
						value={form.date}
						onChange={(e) => set("date", e.target.value)}
					/>
					{errors.date && (
						<p className="mt-1 text-xs text-red-600">{errors.date}</p>
					)}
				</div>
			</div>

			{/* -- File Section --------------------------------------- */}
			<div className="space-y-3">
				{/* Show existing file when editing and billUrl exists */}
				{hasBill && !file && (
					<FilePreview url={initial!.billUrl!} label="Current Bill" />
				)}

				{/* File input */}
				<div className="space-y-1">
					<label className="block text-sm font-medium text-gray-700">
						{hasBill ? "Replace File" : "Upload File (optional)"}
					</label>
					<input
						ref={fileRef}
						type="file"
						accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100 transition"
					/>
				</div>

				{/* New file selected — show name, size, preview */}
				{file && (
					<div className="rounded-lg border border-gray-200 p-3 space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-gray-500">📎</span>
							<span className="flex-1 truncate text-gray-700">{file.name}</span>
							<span className="text-xs text-gray-400">
								{(file.size / 1024).toFixed(1)} KB
							</span>
							<button
								type="button"
								onClick={clearFile}
								className="text-red-400 hover:text-red-600"
							>
								✕
							</button>
						</div>

						{/* Local image preview */}
						{preview && (
							<img
								src={preview}
								alt="Selected file preview"
								className="max-h-36 rounded border border-gray-200 object-contain"
							/>
						)}

						{hasBill && (
							<p className="text-xs text-amber-600">
								This will replace the current bill on save.
							</p>
						)}
					</div>
				)}
			</div>

			<div className="flex justify-end pt-2">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving…" : isEdit ? "Update Expense" : "Add Expense"}
				</Button>
			</div>
		</form>
	);
}
