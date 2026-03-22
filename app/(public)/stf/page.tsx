import type { Metadata } from "next";
import { SUBSCRIPTION_PLANS } from "@/utils/mock-data";
import PlanCard from "@/components/PlanCard";

export const metadata: Metadata = {
	title: "Soil to Fork — Subscription Plans | Freshroot Farms",
	description:
		"Choose from flexible organic produce subscription plans. Farm-fresh vegetables and fruits delivered to your doorstep.",
};

export default function STFPage() {
	return (
		<section className="bg-gradient-to-b from-green-50 to-white py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-4xl font-extrabold text-gray-900">
						Fresh Produce <span className="text-green-700">Packages</span>
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-gray-700">
						Fresh Vegetable Basket
					</p>
					<p className="mx-auto mt-2 max-w-2xl text-gray-600">
						Farm-fresh organic vegetables harvested and delivered within 24
						hours. Pick the plan that fits your household.
					</p>
				</div>

				{/* Plan Cards */}
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{SUBSCRIPTION_PLANS.map((plan) => (
						<PlanCard key={plan.id} plan={plan} />
					))}
				</div>

				{/* Bottom note */}
				<p className="mt-12 text-center text-sm italic text-gray-500">
					*Two deliveries per week, scheduled for Wednesdays and Saturdays.
					Prices inclusive of delivery.
				</p>
			</div>
		</section>
	);
}
