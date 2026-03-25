// -- Subscription Plans (STF) ---------------------------------------
export interface PlanPricing {
	monthly: number;
	quarterly: number;
	halfYearly: number;
	yearly: number;
}

export interface SubscriptionPlan {
	id: string;
	name: string;
	subtitle: string;
	pricing: PlanPricing;
	features: string[];
	popular?: boolean;
}

// -- Kitchen Garden -------------------------------------------------
export interface GardenTier {
	label: string;
	setupCost?: number;
	production: string;
	weekdayPrice: number;
	weekendPrice?: number;
}

export interface GardenPackage {
	id: string;
	name: string;
	duration: string;
	inclusions: string;
	tiers: GardenTier[];
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

// -- Dashboard ------------------------------------------------------
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

// -- Customer Dashboard API Response --------------------------------
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
	planUsage?: PlanUsage;
}

// -- Plan Usage (Customer) ------------------------------------------
export interface PlanUsage {
	totalQty: number;
	usedQty: number;
	remainingQty: number;
	unit: string;
}

// -- Customer Delivered / Upcoming Orders ---------------------------
export interface CustomerOrderItem {
	vegetableName: string;
	quantity: number;
	unit: string;
	vegetableId?: number;
}

export interface CustomerDeliveredOrder {
	id: string;
	date: string;
	items: CustomerOrderItem[];
	totalQty: number;
}

export interface CustomerUpcomingDelivery {
	id: string;
	orderId?: string;
	date: string;
	items: CustomerOrderItem[];
	totalQty: number;
	status: "scheduled" | "in-transit" | "out-for-delivery" | "skipped";
}

// -- Admin Dashboard API Response -----------------------------------
export interface AdminCustomer {
	id: string;
	name: string;
	email: string | null;
	phone?: string;
	address?: string;
	plan?: string;
	joined?: string;
	status?: "active" | "inactive";
	createdAt?: string;
	/** Subscriptions array returned by API */
	subscriptions?: {
		id?: number;
		type?: string;
		package?: string;
		actualPrice?: number | null;
		offerPrice?: number | null;
		paymentTerms?: string | null;
		startDate?: string;
		status?: string;
	}[];
}

export type OrderStatus =
	| "pending"
	| "confirmed"
	| "processing"
	| "delivered"
	| "cancelled"
	| "missed";

export interface AdminOrderItem {
	name: string;
	unit: string;
	quantity: number;
	vegetableId: number;
}

export interface AdminOrder {
	id: string;
	customerId: number;
	customerName?: string;
	items: AdminOrderItem[] | string[];
	total?: number;
	totalAmount?: number;
	date?: string;
	deliveryDate?: string;
	status: OrderStatus;
	notes?: string | null;
	createdAt?: string;
	customer?: { id: number; name: string };
}

export interface AdminExpense {
	id: string;
	category: string;
	description: string;
	amount: number;
	date: string;
	paidTo?: string | null;
	receipt?: string | null;
	billUrl?: string | null;
	createdAt?: string;
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

// -- Form / Mutation Types ------------------------------------------
export interface SubscriptionFormData {
	type: "STF" | "KG" | "";
	package: string;
	actualPrice: number | "";
	offerPrice: number | "";
	paymentTerms: string;
	startDate: string;
	status: "active" | "inactive";
}

export interface CustomerFormData {
	name: string;
	phone: string;
	email: string;
	address: string;
	subscription?: SubscriptionFormData;
}

export interface OrderItemInput {
	itemName: string;
	quantity: number;
	unit: "kg" | "piece";
}

export interface OrderFormData {
	customerId: string | number;
	items: OrderItemInput[];
	date?: string;
	status?: OrderStatus;
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

// -- Upcoming Deliveries --------------------------------------------
export interface UpcomingDelivery {
	id: string;
	orderId?: string;
	customerName: string;
	items: (string | { name: string; unit?: string; quantity?: number })[];
	total?: number;
	date: string;
	status: string;
	computedStatus?: string;
}

// -- Vegetable Pricing ----------------------------------------------
export interface VegetablePrice {
	vegetableId: number;
	name: string;
	price: number | null;
}

export interface SetPricesPayload {
	date: string;
	prices: { vegetableId: number; price: number }[];
}

// -- Orders By Date -------------------------------------------------
export interface OrderByDateItem {
	id: string;
	customerName: string;
	items: (string | { name: string; unit?: string; quantity?: number })[];
	total: number;
	cost: number | null;
	status: string;
	computedStatus?: string;
}

export interface OrdersByDateGroup {
	date: string;
	orders: OrderByDateItem[];
}

// -- Analytics ------------------------------------------------------

export interface AnalyticsSummary {
	totalOrders: number;
	delivered: number;
	missed: number;
	cancelled: number;
}

export interface MissedDelivery {
	id: string;
	customerName: string;
	date: string;
	items: Array<string | { name: string }>;
}

export interface TrendDataPoint {
	date: string;
	total: number;
}

export interface TopVegetable {
	vegetableName: string;
	totalQty: number;
}

// -- Lead / Quote Request -------------------------------------------
export type LeadStatus = "new" | "contacted" | "converted";

export interface LeadFormData {
	name: string;
	phone: string;
	email: string;
	areaSize: string;
	planType: string;
	message: string;
}

export interface Lead {
	id: string;
	name: string;
	phone: string;
	email: string;
	areaSize: string;
	planType: string;
	message: string;
	status: LeadStatus;
	createdAt: string;
}
