const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/* ── Types ──────────────────────────────────────────────────────── */
export interface SupportTicket {
	id: string;
	issueType: string;
	deliveryId: string;
	description: string;
	status: "open" | "in-progress" | "resolved" | "closed";
	createdAt: string;
}

export interface TicketMessage {
	id: string;
	sender: "customer" | "support";
	text: string;
	createdAt: string;
}

export interface TicketDetail extends SupportTicket {
	messages: TicketMessage[];
}

export interface CreateTicketPayload {
	issueType: string;
	deliveryId: string;
	description: string;
	image?: File;
}

/* ── API ────────────────────────────────────────────────────────── */

/** POST /support/tickets — Create a support ticket */
export async function createTicket(
	data: CreateTicketPayload,
): Promise<SupportTicket> {
	const fd = new FormData();
	fd.append("issueType", data.issueType);
	fd.append("deliveryId", data.deliveryId);
	fd.append("description", data.description);
	if (data.image) fd.append("image", data.image);

	const res = await fetch(`${API_BASE}/support/tickets`, {
		method: "POST",
		body: fd,
	});
	if (!res.ok) throw new Error(`Failed to create ticket (${res.status})`);
	return res.json();
}

/** GET /support/tickets — List user's tickets */
export async function getTickets(): Promise<SupportTicket[]> {
	const res = await fetch(`${API_BASE}/support/tickets`);
	if (!res.ok) throw new Error(`Failed to fetch tickets (${res.status})`);
	return res.json();
}

/** GET /support/tickets/:id — Get ticket detail with messages */
export async function getTicketDetail(id: string): Promise<TicketDetail> {
	const res = await fetch(`${API_BASE}/support/tickets/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch ticket (${res.status})`);
	return res.json();
}

/** POST /support/tickets/:id/messages — Send a message */
export async function sendMessage(
	ticketId: string,
	text: string,
): Promise<TicketMessage> {
	const res = await fetch(`${API_BASE}/support/tickets/${ticketId}/messages`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	});
	if (!res.ok) throw new Error(`Failed to send message (${res.status})`);
	return res.json();
}
