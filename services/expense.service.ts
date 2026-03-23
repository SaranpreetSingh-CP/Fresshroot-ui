import type { ExpenseFormData } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** Build FormData from ExpenseFormData */
function buildFormData(data: ExpenseFormData): FormData {
	const formData = new FormData();
	formData.append("category", data.category);
	formData.append("description", data.description);
	formData.append("amount", String(data.amount));
	formData.append("date", data.date);
	if (data.file) {
		formData.append("file", data.file);
	}
	return formData;
}

/** POST /expenses — Create a new expense (multipart for file upload) */
export async function createExpense(data: ExpenseFormData) {
	const res = await fetch(`${API_BASE}/expenses`, {
		method: "POST",
		body: buildFormData(data),
	});
	if (!res.ok) throw new Error(`Failed to create expense (${res.status})`);
	return res.json();
}

/** PATCH /expenses/:id — Update an existing expense */
export async function updateExpense(
	id: string,
	data: Partial<ExpenseFormData>,
) {
	// If a file is attached, use multipart/form-data
	if (data.file) {
		const formData = new FormData();
		if (data.category) formData.append("category", data.category);
		if (data.description) formData.append("description", data.description);
		if (data.amount !== undefined)
			formData.append("amount", String(data.amount));
		if (data.date) formData.append("date", data.date);
		formData.append("file", data.file);

		const res = await fetch(`${API_BASE}/expenses/${id}`, {
			method: "PATCH",
			body: formData,
		});
		if (!res.ok) throw new Error(`Failed to update expense (${res.status})`);
		return res.json();
	}

	// No file — send plain JSON
	const { file: _file, ...jsonBody } = data;
	const res = await fetch(`${API_BASE}/expenses/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(jsonBody),
	});
	if (!res.ok) throw new Error(`Failed to update expense (${res.status})`);
	return res.json();
}

/** GET /expenses — Fetch all expenses (with id, billUrl, etc.) */
export async function getExpenses() {
	const res = await fetch(`${API_BASE}/expenses`);
	if (!res.ok) throw new Error(`Failed to fetch expenses (${res.status})`);
	return res.json();
}

/** GET /expenses/:id — Fetch a single expense */
export async function getExpenseById(id: string) {
	const res = await fetch(`${API_BASE}/expenses/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch expense (${res.status})`);
	return res.json();
}
