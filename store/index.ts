"use client";

import { create } from "zustand";
import type { BookingFormData, Subscription, Delivery } from "@/utils/types";

// -- UI Store -------------------------------------------------------
interface UIState {
	mobileMenuOpen: boolean;
	toggleMobileMenu: () => void;
	closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	mobileMenuOpen: false,
	toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
	closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));

// -- Customer Store -------------------------------------------------
interface CustomerState {
	subscriptions: Subscription[];
	deliveries: Delivery[];
	setSubscriptions: (subs: Subscription[]) => void;
	setDeliveries: (dels: Delivery[]) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
	subscriptions: [],
	deliveries: [],
	setSubscriptions: (subscriptions) => set({ subscriptions }),
	setDeliveries: (deliveries) => set({ deliveries }),
}));

// -- Booking Store --------------------------------------------------
interface BookingState {
	formData: BookingFormData;
	setField: <K extends keyof BookingFormData>(
		key: K,
		value: BookingFormData[K],
	) => void;
	resetForm: () => void;
}

const initialBookingData: BookingFormData = {
	name: "",
	email: "",
	phone: "",
	address: "",
	packageId: "",
	preferredDate: "",
	message: "",
};

export const useBookingStore = create<BookingState>((set) => ({
	formData: { ...initialBookingData },
	setField: (key, value) =>
		set((s) => ({ formData: { ...s.formData, [key]: value } })),
	resetForm: () => set({ formData: { ...initialBookingData } }),
}));
