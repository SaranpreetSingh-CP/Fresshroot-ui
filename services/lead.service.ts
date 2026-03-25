import type { LeadFormData, Lead, LeadStatus } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** POST /leads — Submit a quote request */
export async function createLead(data: LeadFormData): Promise<Lead> {
	const res = await fetch(`${API_BASE}/leads`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok)
		throw new Error(`Failed to submit quote request (${res.status})`);
	return res.json();
}

/** GET /leads — Fetch all leads (admin) */
export async function getLeads(): Promise<Lead[]> {
	const res = await fetch(`${API_BASE}/leads`);
	if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);
	return res.json();
}

/** PATCH /leads/:id/status — Update lead status */
export async function updateLeadStatus(
	id: string,
	status: LeadStatus,
): Promise<Lead> {
	const res = await fetch(`${API_BASE}/leads/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status }),
	});
	if (!res.ok) throw new Error(`Failed to update lead status (${res.status})`);
	return res.json();
}
