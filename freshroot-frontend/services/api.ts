import type {
  SubscriptionPlan,
  GardenPackage,
  BookingFormData,
  Subscription,
  Delivery,
  Customer,
  Order,
  Expense,
} from "@/utils/types";
import {
  SUBSCRIPTION_PLANS,
  GARDEN_PACKAGES,
  MOCK_SUBSCRIPTIONS,
  MOCK_DELIVERIES,
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_EXPENSES,
} from "@/utils/mock-data";

/* ──────────────────────────────────────────────────────────────────
   Placeholder API functions — replace with real fetch calls when
   the backend is ready.
   ────────────────────────────────────────────────────────────────── */

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Public ─────────────────────────────────────────────────────────
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  await delay();
  return SUBSCRIPTION_PLANS;
}

export async function getGardenPackages(): Promise<GardenPackage[]> {
  await delay();
  return GARDEN_PACKAGES;
}

export async function submitBooking(
  data: BookingFormData,
): Promise<{ success: boolean; message: string }> {
  await delay(500);
  console.log("[API] Booking submitted:", data);
  return { success: true, message: "Booking request submitted successfully!" };
}

// ── Customer Dashboard ─────────────────────────────────────────────
export async function getMySubscriptions(): Promise<Subscription[]> {
  await delay();
  return MOCK_SUBSCRIPTIONS;
}

export async function getMyDeliveries(): Promise<Delivery[]> {
  await delay();
  return MOCK_DELIVERIES;
}

// ── Admin Dashboard ────────────────────────────────────────────────
export async function getCustomers(): Promise<Customer[]> {
  await delay();
  return MOCK_CUSTOMERS;
}

export async function getOrders(): Promise<Order[]> {
  await delay();
  return MOCK_ORDERS;
}

export async function getExpenses(): Promise<Expense[]> {
  await delay();
  return MOCK_EXPENSES;
}
