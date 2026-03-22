import Link from "next/link";
import Card, {
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/Card";
import Badge from "@/components/Badge";
import type { SubscriptionPlan } from "@/utils/types";

const formatPrice = (v: number) => `₹${v.toLocaleString("en-IN")}`;

const TIERS = [
	{ key: "monthly" as const, label: "Monthly" },
	{ key: "quarterly" as const, label: "Quarterly" },
	{ key: "halfYearly" as const, label: "Half-Yearly" },
	{ key: "yearly" as const, label: "Yearly" },
];

interface PlanCardProps {
	plan: SubscriptionPlan;
	ctaHref?: string;
	ctaLabel?: string;
}

export default function PlanCard({
	plan,
	ctaHref = "/dashboard/customer",
	ctaLabel = "Get Started",
}: PlanCardProps) {
	return (
		<Card highlight={plan.popular} className="flex flex-col justify-between">
			<div>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{plan.name}</CardTitle>
							<p className="mt-1 text-sm font-medium text-gray-500">
								{plan.subtitle}
							</p>
						</div>
						{plan.popular && <Badge variant="green">Popular</Badge>}
					</div>
				</CardHeader>

				<CardContent>
					{/* Pricing table */}
					<div className="overflow-hidden rounded-lg border border-gray-200">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-3 py-2 text-left font-semibold text-gray-700">
										Plan
									</th>
									<th className="px-3 py-2 text-right font-semibold text-gray-700">
										Price (₹)
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{TIERS.map((tier) => (
									<tr
										key={tier.key}
										className="hover:bg-green-50/40 transition"
									>
										<td className="px-3 py-2 text-gray-600">{tier.label}</td>
										<td className="px-3 py-2 text-right font-medium text-gray-900">
											{formatPrice(plan.pricing[tier.key])}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Features */}
					<ul className="mt-5 space-y-2">
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

			<CardFooter className="mt-6">
				<Link
					href={ctaHref}
					className={`w-full rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
						plan.popular
							? "bg-green-700 text-white hover:bg-green-800"
							: "border-2 border-green-700 text-green-700 hover:bg-green-50"
					}`}
				>
					{ctaLabel}
				</Link>
			</CardFooter>
		</Card>
	);
}
