import type { Metadata } from "next";
import { SUBSCRIPTION_PLANS } from "@/utils/mock-data";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/Card";
import Badge from "@/components/Badge";
import Link from "next/link";

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
            Fresh, organic produce harvested and delivered within 24 hours.
            Pick the plan that fits your household and taste.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card
              key={plan.id}
              highlight={plan.popular}
              className="flex flex-col justify-between"
            >
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.popular && <Badge variant="green">Popular</Badge>}
                  </div>
                  <p className="mt-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-gray-500">
                      /{plan.duration}
                    </span>
                  </p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="mt-0.5 text-green-600">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="mt-8">
                <Link
                  href="/dashboard/customer"
                  className={`w-full rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : "border-2 border-green-700 text-green-700 hover:bg-green-50"
                  }`}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
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
