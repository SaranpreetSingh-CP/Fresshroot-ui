// ── Subscription Plans (STF) ───────────────────────────────────────
export interface SubscriptionPlan {
	id: string;
	name: string;
	price: number;
	duration: string;
	features: string[];
	popular?: boolean;
}

// ── Kitchen Garden ─────────────────────────────────────────────────
export interface GardenPackage {
	id: string;
	name: string;
	description: string;
	price: number;
	area: string;
	plants: string[];
	image?: string;
}

export interface BookingFormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	packageId: string;
	preferredDate: string;
	message?: string;
}

// ── Dashboard ──────────────────────────────────────────────────────
export interface Subscription {
	id: string;
	plan: string;
	status: "active" | "paused" | "cancelled";
	startDate: string;
	nextDelivery: string;
}

export interface Delivery {
	id: string;
	date: string;
	status: "delivered" | "in-transit" | "scheduled" | "cancelled";
	items: string[];
}

export interface Customer {
	id: string;
	name: string;
	email: string;
	plan: string;
	joinedDate: string;
	status: "active" | "inactive";
}

export interface Order {
	id: string;
	customerName: string;
	items: string[];
	total: number;
	date: string;
	status: "pending" | "processing" | "delivered" | "cancelled";
}

export interface Expense {
	id: string;
	category: string;
	description: string;
	amount: number;
	date: string;
}

// ── Customer Dashboard API Response ────────────────────────────────
export interface DashboardSubscription {
	name: string;
	status: "active" | "paused" | "cancelled";
	startDate: string;
	nextDelivery: string;
}

export interface DashboardDelivery {
	id: string;
	date: string;
	items: string[];
	status:
		| "delivered"
		| "in-transit"
		| "scheduled"
		| "cancelled"
		| "not-started"
		| "out-for-delivery";
}

export interface CustomerDashboardResponse {
	activePlans: number;
	upcomingDeliveries: number;
	itemsDelivered: number;
	subscriptions: DashboardSubscription[];
	deliveries: DashboardDelivery[];
}

// ── Admin Dashboard API Response ───────────────────────────────────
export interface AdminCustomer {
	id: string;
	name: string;
	email: string | null;
	phone?: string;
	address?: string;
	plan: string;
	joined: string;
	status: "active" | "inactive";
}

export interface AdminOrder {
	id: string;
	customerName: string;
	items: string[];
	total: number;
	date: string;
	status: "pending" | "processing" | "delivered" | "cancelled";
}

export interface AdminExpense {
	category: string;
	description: string;
	amount: number;
	date: string;
}

export interface AdminDashboardSummary {
	totalCustomers: number;
	activeCustomers: number;
	revenue: number;
	expenses: number;
}

export interface AdminDashboardResponse {
	summary: AdminDashboardSummary;
	customers: AdminCustomer[];
	orders: AdminOrder[];
	expenses: AdminExpense[];
}

// ── Form / Mutation Types ──────────────────────────────────────────
export interface CustomerFormData {
	name: string;
	phone: string;
	email: string;
	address: string;
}

export interface OrderItemInput {
	itemName: string;
	quantity: number;
	unit: "kg" | "piece";
}

export interface OrderFormData {
	customerId: string;
	items: OrderItemInput[];
}

export interface ExpenseFormData {
	category: string;
	description: string;
	amount: number;
	date: string;
	file?: File;
}

export type DeliveryStatus =
	| "not-started"
	| "in-transit"
	| "out-for-delivery"
	| "delivered";
