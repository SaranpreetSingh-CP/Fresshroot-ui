interface AdminSummaryCardsProps {
	totalCustomers: number;
	activeCustomers: number;
	revenue: number;
	expenses: number;
	todayDeliveries: number;
	pendingOrders: number;
}

function formatCurrency(value: number): string {
	return `₹${(value ?? 0).toLocaleString("en-IN")}`;
}

interface StatConfig {
	key: string;
	label: string;
	icon: string;
	currency: boolean;
	color: string;
}

const stats: StatConfig[] = [
	{
		key: "todayDeliveries",
		label: "Today Deliveries",
		icon: "🚚",
		currency: false,
		color: "bg-blue-50 text-blue-700",
	},
	{
		key: "pendingOrders",
		label: "Pending Orders",
		icon: "⏳",
		currency: false,
		color: "bg-amber-50 text-amber-700",
	},
	{
		key: "activeCustomers",
		label: "Active Customers",
		icon: "✅",
		currency: false,
		color: "bg-green-50 text-green-700",
	},
	{
		key: "totalCustomers",
		label: "Total Customers",
		icon: "👥",
		currency: false,
		color: "bg-gray-50 text-gray-700",
	},
	{
		key: "revenue",
		label: "Revenue",
		icon: "💰",
		currency: true,
		color: "bg-emerald-50 text-emerald-700",
	},
	{
		key: "expenses",
		label: "Expenses",
		icon: "📊",
		currency: true,
		color: "bg-red-50 text-red-700",
	},
];

export default function AdminSummaryCards(props: AdminSummaryCardsProps) {
	const values: Record<string, number> = {
		totalCustomers: props.totalCustomers,
		activeCustomers: props.activeCustomers,
		revenue: props.revenue,
		expenses: props.expenses,
		todayDeliveries: props.todayDeliveries,
		pendingOrders: props.pendingOrders,
	};

	return (
		<div className="grid gap-3 grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
			{stats.map((stat) => {
				const raw = values[stat.key] ?? 0;
				const display = stat.currency ? formatCurrency(raw) : raw;
				return (
					<div
						key={stat.key}
						className="rounded-xl border border-gray-100 shadow-sm p-4 transition hover:shadow-md"
					>
						<div className="flex items-center gap-2 mb-1.5">
							<span
								className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${stat.color}`}
							>
								{stat.icon}
							</span>
						</div>
						<p className="text-lg font-bold text-gray-900 leading-tight">
							{display}
						</p>
						<p className="text-[11px] text-gray-500 leading-tight mt-0.5">
							{stat.label}
						</p>
					</div>
				);
			})}
		</div>
	);
}
