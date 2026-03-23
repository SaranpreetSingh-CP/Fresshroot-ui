import type { OrderFormData, OrderStatus } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** GET /orders — List all orders */
export async function getOrders() {
	const res = await fetch(`${API_BASE}/orders`);
	if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
	return res.json();
}

/** GET /orders/:id — Fetch a single order */
export async function getOrderById(id: string) {
	const res = await fetch(`${API_BASE}/orders/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch order (${res.status})`);
	return res.json();
}

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

/** PATCH /orders/:id — Update an existing order */
export async function updateOrder(id: string, data: Partial<OrderFormData>) {
	const res = await fetch(`${API_BASE}/orders/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to update order (${res.status})`);
	return res.json();
}

/** PATCH /orders/:id/status — Update just the order status */
export async function updateOrderStatus(id: string, status: OrderStatus) {
	const res = await fetch(`${API_BASE}/orders/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status }),
	});
	if (!res.ok) throw new Error(`Failed to update order status (${res.status})`);
	return res.json();
}

/** DELETE /orders/:id — Delete an order */
export async function deleteOrder(id: string) {
	const res = await fetch(`${API_BASE}/orders/${id}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error(`Failed to delete order (${res.status})`);
	return res.json();
}
