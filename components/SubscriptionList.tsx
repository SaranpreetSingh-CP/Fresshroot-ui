import Card from "@/components/Card";
import Badge from "@/components/Badge";

interface Subscription {
	id: number;
	type: string;
	package: string;
	status: string;
	startDate: string;
}

function formatDate(raw: string): string {
	return new Date(raw).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function statusVariant(s: string) {
	switch (s.toLowerCase()) {
		case "active":
			return "green" as const;
		case "paused":
			return "amber" as const;
		case "cancelled":
		case "expired":
			return "red" as const;
		default:
			return "gray" as const;
	}
}

interface SubscriptionListProps {
	subscriptions: Subscription[];
}

export default function SubscriptionList({
	subscriptions,
}: SubscriptionListProps) {
	if (subscriptions.length === 0) {
		return (
			<Card>
				<h2 className="mb-4 text-lg font-bold text-gray-900">Subscriptions</h2>
				<p className="py-6 text-center text-sm text-gray-400">
					No subscriptions found.
				</p>
			</Card>
		);
	}

	return (
		<div>
			<h2 className="mb-3 text-lg font-bold text-gray-900">Subscriptions</h2>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{subscriptions.map((sub) => (
					<Card key={sub.id}>
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-semibold text-gray-900">
									{sub.package}
								</p>
								<p className="mt-0.5 text-xs text-gray-500">
									{sub.type === "STF"
										? "Subscription to Freshness"
										: sub.type === "KG"
											? "Kitchen Garden"
											: sub.type}
								</p>
							</div>
							<Badge variant={statusVariant(sub.status)}>{sub.status}</Badge>
						</div>
						<p className="mt-3 text-xs text-gray-500">
							Started:{" "}
							<span className="font-medium text-gray-700">
								{formatDate(sub.startDate)}
							</span>
						</p>
					</Card>
				))}
			</div>
		</div>
	);
}
