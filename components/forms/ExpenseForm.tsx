"use client";

import { useState, useRef, type FormEvent } from "react";
import { Input, Select } from "@/components/FormFields";
import Button from "@/components/Button";
import type { ExpenseFormData } from "@/utils/types";

interface ExpenseFormProps {
	onSubmit: (data: ExpenseFormData) => void;
	isSubmitting?: boolean;
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
}: ExpenseFormProps) {
	const [form, setForm] = useState({
		category: "",
		description: "",
		amount: "",
		date: new Date().toISOString().slice(0, 10),
	});
	const [file, setFile] = useState<File | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const fileRef = useRef<HTMLInputElement>(null);

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

			{/* File upload */}
			<div className="space-y-1">
				<label className="block text-sm font-medium text-gray-700">
					Upload File (optional)
				</label>
				<input
					ref={fileRef}
					type="file"
					accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100 transition"
				/>
				{file && (
					<div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 p-2 text-sm">
						<span className="text-gray-500">📎</span>
						<span className="flex-1 truncate text-gray-700">{file.name}</span>
						<span className="text-xs text-gray-400">
							{(file.size / 1024).toFixed(1)} KB
						</span>
						<button
							type="button"
							onClick={() => {
								setFile(null);
								if (fileRef.current) fileRef.current.value = "";
							}}
							className="text-red-400 hover:text-red-600"
						>
							✕
						</button>
					</div>
				)}
			</div>

			<div className="flex justify-end pt-2">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving…" : "Add Expense"}
				</Button>
			</div>
		</form>
	);
}
