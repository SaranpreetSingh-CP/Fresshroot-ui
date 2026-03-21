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
						Soil to Fork <span className="text-green-700">Plans</span>
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-gray-600">
						Fresh, organic produce harvested and delivered within 24 hours. Pick
						the plan that fits your household and taste.
					</p>
				</div>

				{/* Plan Cards */}
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{SUBSCRIPTION_PLANS.map((plan) => (
						<PlanCard key={plan.id} plan={plan} />
					))}
				</div>

				{/* Bottom note */}
				<p className="mt-12 text-center text-sm text-gray-500">
					All plans are month-to-month — cancel or switch anytime. Prices
					inclusive of delivery.
				</p>
			</div>
		</section>
	);
}
