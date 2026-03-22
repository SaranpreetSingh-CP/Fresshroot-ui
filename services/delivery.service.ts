import type { DeliveryStatus } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** PATCH /deliveries/:id/status — Update delivery status */
export async function updateDeliveryStatus(id: string, status: DeliveryStatus) {
	const res = await fetch(`${API_BASE}/deliveries/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status }),
	});
	if (!res.ok)
		throw new Error(`Failed to update delivery status (${res.status})`);
	return res.json();
}
