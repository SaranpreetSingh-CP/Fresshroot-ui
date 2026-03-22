import type { ExpenseFormData } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** POST /expenses — Create a new expense (multipart for file upload) */
export async function createExpense(data: ExpenseFormData) {
	const formData = new FormData();
	formData.append("category", data.category);
	formData.append("description", data.description);
	formData.append("amount", String(data.amount));
	formData.append("date", data.date);
	if (data.file) {
		formData.append("file", data.file);
	}

	const res = await fetch(`${API_BASE}/expenses`, {
		method: "POST",
		body: formData,
	});
	if (!res.ok) throw new Error(`Failed to create expense (${res.status})`);
	return res.json();
}
