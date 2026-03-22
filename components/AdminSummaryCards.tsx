import Card from "@/components/Card";

interface AdminSummaryCardsProps {
	totalCustomers: number;
	activeCustomers: number;
	revenue: number;
	expenses: number;
}

function formatCurrency(value: number): string {
	return `₹${(value ?? 0).toLocaleString("en-IN")}`;
}

const stats = [
	{
		key: "totalCustomers",
		label: "Total Customers",
		icon: "👥",
		currency: false,
	},
	{ key: "activeCustomers", label: "Active", icon: "✅", currency: false },
	{ key: "revenue", label: "Revenue", icon: "💰", currency: true },
	{ key: "expenses", label: "Expenses", icon: "📊", currency: true },
] as const;

export default function AdminSummaryCards(props: AdminSummaryCardsProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-4">
			{stats.map((stat) => {
				const raw = props[stat.key];
				const display = stat.currency ? formatCurrency(raw) : raw;
				return (
					<Card key={stat.key}>
						<div className="flex items-center gap-4">
							<span className="text-3xl">{stat.icon}</span>
							<div>
								<p className="text-xl font-bold text-gray-900">{display}</p>
								<p className="text-sm text-gray-500">{stat.label}</p>
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
