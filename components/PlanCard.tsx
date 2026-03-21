import Link from "next/link";
import Card, {
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/Card";
import Badge from "@/components/Badge";
import type { SubscriptionPlan } from "@/utils/types";

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
						<CardTitle>{plan.name}</CardTitle>
						{plan.popular && <Badge variant="green">Popular</Badge>}
					</div>
					<p className="mt-2">
						<span className="text-3xl font-extrabold text-gray-900">
							₹{plan.price.toLocaleString("en-IN")}
						</span>
						<span className="text-sm text-gray-500">/{plan.duration}</span>
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
