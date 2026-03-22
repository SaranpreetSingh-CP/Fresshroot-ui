import type { OrderFormData } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** POST /orders — Create a new order */
export async function createOrder(data: OrderFormData) {
	const res = await fetch(`${API_BASE}/orders`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to create order (${res.status})`);
	return res.json();
}
