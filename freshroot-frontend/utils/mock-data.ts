import type {
  SubscriptionPlan,
  GardenPackage,
  Subscription,
  Delivery,
  Customer,
  Order,
  Expense,
} from "./types";

// ── STF Subscription Plans ─────────────────────────────────────────
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Starter Basket",
    price: 999,
    duration: "month",
    features: [
      "5 kg seasonal vegetables",
      "Weekly delivery",
      "Basic recipe cards",
      "Email support",
    ],
  },
  {
    id: "plan-standard",
    name: "Family Harvest",
    price: 1999,
    duration: "month",
    popular: true,
    features: [
      "12 kg seasonal vegetables",
      "2 kg fruits",
      "Twice-weekly delivery",
      "Recipe cards & meal plans",
      "Priority support",
    ],
  },
  {
    id: "plan-premium",
    name: "Farm Feast",
    price: 3499,
    duration: "month",
    features: [
      "20 kg seasonal vegetables",
      "5 kg fruits",
      "Daily delivery",
      "Personalized meal plans",
      "Farm visit access",
      "Dedicated support",
    ],
  },
];

// ── Kitchen Garden Packages ────────────────────────────────────────
export const GARDEN_PACKAGES: GardenPackage[] = [
  {
    id: "garden-balcony",
    name: "Balcony Garden",
    description:
      "Perfect for apartments. Vertical planters with herbs and greens.",
    price: 4999,
    area: "50 sq ft",
    plants: ["Basil", "Mint", "Lettuce", "Cherry Tomatoes", "Chillies"],
  },
  {
    id: "garden-terrace",
    name: "Terrace Farm",
    description:
      "Transform your terrace into a thriving farm with raised beds.",
    price: 14999,
    area: "200 sq ft",
    plants: [
      "Tomatoes",
      "Spinach",
      "Brinjal",
      "Capsicum",
      "Coriander",
      "Curry Leaves",
      "Beans",
    ],
  },
  {
    id: "garden-backyard",
    name: "Backyard Homestead",
    description:
      "Full-scale kitchen garden with drip irrigation and composting setup.",
    price: 29999,
    area: "500+ sq ft",
    plants: [
      "Seasonal Vegetables",
      "Fruit Saplings",
      "Herbs",
      "Microgreens",
      "Medicinal Plants",
    ],
  },
];

// ── Customer Dashboard Mock ────────────────────────────────────────
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

// ── Admin Dashboard Mock ───────────────────────────────────────────
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

// ── Testimonials ───────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: "t-1",
    name: "Ananya Rao",
    role: "Home Chef",
    quote:
      "Freshroot Farms transformed the way I cook. The vegetables are incredibly fresh and flavourful — nothing like what you get at the supermarket.",
  },
  {
    id: "t-2",
    name: "Karthik Menon",
    role: "Fitness Enthusiast",
    quote:
      "I subscribed to the Family Harvest plan and the quality has been consistently outstanding. My family loves the weekly deliveries!",
  },
  {
    id: "t-3",
    name: "Divya Iyer",
    role: "Urban Gardener",
    quote:
      "The Kitchen Garden setup was seamless. Their team set up my terrace farm in a day, and now I grow my own greens!",
  },
] as const;
