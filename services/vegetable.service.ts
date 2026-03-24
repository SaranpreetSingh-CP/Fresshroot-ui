const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/* -- Types -------------------------------------------------------- */
export interface Vegetable {
	id: number;
	name: string;
	hindiName: string;
	category: string;
	unit: "kg" | "piece";
	available?: boolean;
}

/* -- API ---------------------------------------------------------- */

/** GET /vegetables/available — Fetch currently available vegetables */
export async function getAvailableVegetables(): Promise<Vegetable[]> {
	const res = await fetch(`${API_BASE}/vegetables/available`);
	if (!res.ok) throw new Error(`Failed to fetch vegetables (${res.status})`);
	return res.json();
}
