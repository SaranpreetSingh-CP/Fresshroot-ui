import type {
	SubscriptionPlan,
	GardenPackage,
	Subscription,
	Delivery,
	Customer,
	Order,
	Expense,
} from "./types";

// -- STF Subscription Plans -----------------------------------------
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
	{
		id: "plan-1pax",
		name: "1 Pax",
		subtitle: "3 Kg / Delivery",
		pricing: {
			monthly: 8000,
			quarterly: 15000,
			halfYearly: 28000,
			yearly: 50000,
		},
		features: [
			"3 Kg fresh vegetables per delivery",
			"2 deliveries per week",
			"Wednesdays & Saturdays",
			"Ideal for individuals",
		],
	},
	{
		id: "plan-2-3pax",
		name: "2–3 Pax",
		subtitle: "5–6 Kg / Delivery",
		popular: true,
		pricing: {
			monthly: 16000,
			quarterly: 30000,
			halfYearly: 56000,
			yearly: 100000,
		},
		features: [
			"5–6 Kg fresh vegetables per delivery",
			"2 deliveries per week",
			"Wednesdays & Saturdays",
			"Perfect for small families",
		],
	},
	{
		id: "plan-4-5pax",
		name: "4–5 Pax",
		subtitle: "10–12 Kg / Delivery",
		pricing: {
			monthly: 32000,
			quarterly: 60000,
			halfYearly: 112000,
			yearly: 200000,
		},
		features: [
			"10–12 Kg fresh vegetables per delivery",
			"2 deliveries per week",
			"Wednesdays & Saturdays",
			"Best for large families",
		],
	},
];

// -- Kitchen Garden Packages ----------------------------------------
export const GARDEN_PACKAGES: GardenPackage[] = [
	{
		id: "grow-bag",
		name: "4-Month Grow Bag Care Package",
		duration: "4 months",
		tiers: [
			{
				label: "30 Grow Bags",
				setupCost: 30000,
				production: "54–60 kg",
				weekdayPrice: 30000,
				weekendPrice: 32000,
			},
			{
				label: "50 Grow Bags",
				setupCost: 50000,
				production: "90–100 kg",
				weekdayPrice: 50000,
				weekendPrice: 52000,
			},
			{
				label: "100 Grow Bags",
				setupCost: 90000,
				production: "180–200 kg",
				weekdayPrice: 85000,
				weekendPrice: 90000,
			},
		],
		inclusions:
			"A complete grow bag solution with grow bags, potting mix, soil, seeds/saplings/crops, bio-agri inputs, weekly Green Officer support (16 visits), and senior agronomist guidance across 4 months.",
	},
	{
		id: "land-area",
		name: "4-Month Land Area Care Package",
		duration: "4 months",
		tiers: [
			{
				label: "200 Sq. Ft.",
				production: "35–40 kg",
				weekdayPrice: 20000,
			},
			{
				label: "500 Sq. Ft.",
				production: "50–60 kg",
				weekdayPrice: 40000,
			},
			{
				label: "1000 Sq. Ft.",
				production: "100–120 kg",
				weekdayPrice: 64000,
			},
		],
		inclusions:
			"Complete package covering potting mix, seeds/saplings/crops, bio-agri inputs, weekly Green Officer support (16 visits), and senior agronomist guidance (4 visits in 4 months).",
	},
];

// -- Customer Dashboard Mock ----------------------------------------
export const MOCK_SUBSCRIPTIONS: Subscription[] = [
	{
		id: "sub-1",
		plan: "Family Harvest",
		status: "active",
		startDate: "2026-01-15",
		nextDelivery: "2026-03-23",
	},
	{
		id: "sub-2",
		plan: "Balcony Garden Maintenance",
		status: "paused",
		startDate: "2025-10-01",
		nextDelivery: "—",
	},
];

export const MOCK_DELIVERIES: Delivery[] = [
	{
		id: "del-1",
		date: "2026-03-20",
		status: "delivered",
		items: ["Tomatoes", "Spinach", "Capsicum", "Coriander"],
	},
	{
		id: "del-2",
		date: "2026-03-23",
		status: "in-transit",
		items: ["Carrots", "Beans", "Lettuce", "Mint"],
	},
	{
		id: "del-3",
		date: "2026-03-27",
		status: "scheduled",
		items: ["Brinjal", "Potatoes", "Onions", "Garlic"],
	},
];

// -- Admin Dashboard Mock -------------------------------------------
export const MOCK_CUSTOMERS: Customer[] = [
	{
		id: "cust-1",
		name: "Rahul Sharma",
		email: "rahul@example.com",
		plan: "Family Harvest",
		joinedDate: "2025-06-12",
		status: "active",
	},
	{
		id: "cust-2",
		name: "Priya Patel",
		email: "priya@example.com",
		plan: "Farm Feast",
		joinedDate: "2025-09-03",
		status: "active",
	},
	{
		id: "cust-3",
		name: "Amit Verma",
		email: "amit@example.com",
		plan: "Starter Basket",
		joinedDate: "2026-01-20",
		status: "inactive",
	},
	{
		id: "cust-4",
		name: "Sneha Gupta",
		email: "sneha@example.com",
		plan: "Family Harvest",
		joinedDate: "2025-11-15",
		status: "active",
	},
];

export const MOCK_ORDERS: Order[] = [
	{
		id: "ord-1",
		customerName: "Rahul Sharma",
		items: ["Tomatoes", "Spinach", "Capsicum"],
		total: 450,
		date: "2026-03-20",
		status: "delivered",
	},
	{
		id: "ord-2",
		customerName: "Priya Patel",
		items: ["Carrots", "Beans", "Lettuce", "Mint", "Basil"],
		total: 780,
		date: "2026-03-21",
		status: "processing",
	},
	{
		id: "ord-3",
		customerName: "Sneha Gupta",
		items: ["Brinjal", "Potatoes"],
		total: 320,
		date: "2026-03-22",
		status: "pending",
	},
];

export const MOCK_EXPENSES: Expense[] = [
	{
		id: "exp-1",
		category: "Seeds & Saplings",
		description: "Seasonal vegetable seeds – Spring batch",
		amount: 12500,
		date: "2026-03-01",
	},
	{
		id: "exp-2",
		category: "Labour",
		description: "Farm workers – March wages",
		amount: 45000,
		date: "2026-03-05",
	},
	{
		id: "exp-3",
		category: "Logistics",
		description: "Delivery vehicle fuel & maintenance",
		amount: 8700,
		date: "2026-03-10",
	},
	{
		id: "exp-4",
		category: "Packaging",
		description: "Eco-friendly packaging material",
		amount: 6200,
		date: "2026-03-12",
	},
];

// -- Testimonials ---------------------------------------------------
export const TESTIMONIALS = [
	{
		id: "t-1",
		name: "Geeta Malhotra",
		role: "Kitchen Garden Customer",
		quote:
			"The Kitchen Garden setup was seamless. Their team transformed my terrace into a thriving farm — I now grow my own greens every season!",
	},
	{
		id: "t-2",
		name: "Arpana Bansal",
		role: "Kitchen Garden Customer",
		quote:
			"Freshroot's grow bag package exceeded my expectations. The agronomist visits keep everything on track and my produce quality is amazing.",
	},
	{
		id: "t-3",
		name: "Gunjan Batra",
		role: "Soil to Fork Subscriber",
		quote:
			"The freshness of the vegetables is unmatched. My family loves the twice-weekly deliveries — it's like having our own farm!",
	},
	{
		id: "t-4",
		name: "Anita Gauri",
		role: "Soil to Fork Subscriber",
		quote:
			"I subscribed to the 2–3 Pax plan and the quality has been consistently outstanding. Nothing like what you get at the supermarket.",
	},
	{
		id: "t-5",
		name: "Ivan Jalauddin",
		role: "Soil to Fork Subscriber",
		quote:
			"Farm-fresh organic produce delivered right to my door. Freshroot Farms truly transformed how my family eats — we wouldn't go back!",
	},
] as const;
