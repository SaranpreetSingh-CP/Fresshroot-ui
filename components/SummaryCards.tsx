import Card from "@/components/Card";

interface SummaryCardsProps {
	activePlans: number;
	upcomingDeliveries: number;
	itemsDelivered: number;
}

const stats = [
	{ key: "activePlans", label: "Active Plans", icon: "📋" },
	{ key: "upcomingDeliveries", label: "Upcoming Deliveries", icon: "🚚" },
	{ key: "itemsDelivered", label: "Items Delivered", icon: "✅" },
] as const;

export default function SummaryCards(props: SummaryCardsProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-3">
			{stats.map((stat) => (
				<Card key={stat.key}>
					<div className="flex items-center gap-4">
						<span className="text-3xl">{stat.icon}</span>
						<div>
							<p className="text-2xl font-bold text-gray-900">
								{props[stat.key]}
							</p>
							<p className="text-sm text-gray-500">{stat.label}</p>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
