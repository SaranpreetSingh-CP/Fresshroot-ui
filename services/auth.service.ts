const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export interface AuthUser {
	id: string;
	name: string;
	phone: string;
	email?: string;
}

/** GET /auth/me — Get current logged-in user */
export async function getMe(): Promise<AuthUser> {
	const res = await fetch(`${API_BASE}/auth/me`);
	if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`);
	return res.json();
}
