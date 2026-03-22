import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Badge from "@/components/Badge";
import type { DashboardSubscription } from "@/utils/types";

const statusColor = {
	active: "green" as const,
	paused: "amber" as const,
	cancelled: "red" as const,
};

interface SubscriptionCardProps {
	subscription: DashboardSubscription;
}

export default function SubscriptionCard({
	subscription,
}: SubscriptionCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>{subscription.name}</CardTitle>
					<Badge variant={statusColor[subscription.status]}>
						{subscription.status}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<dl className="grid grid-cols-2 gap-y-2 text-sm">
					<dt className="text-gray-500">Started</dt>
					<dd className="text-gray-900">{subscription.startDate}</dd>
					<dt className="text-gray-500">Next Delivery</dt>
					<dd className="text-gray-900">{subscription.nextDelivery}</dd>
				</dl>
			</CardContent>
		</Card>
	);
}
