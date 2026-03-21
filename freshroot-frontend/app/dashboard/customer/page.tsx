import type { Metadata } from "next";
import { MOCK_SUBSCRIPTIONS, MOCK_DELIVERIES } from "@/utils/mock-data";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/Card";
import Badge from "@/components/Badge";

export const metadata: Metadata = {
	title: "Customer Dashboard | Freshroot Farms",
};

const statusColor = {
	active: "green" as const,
	paused: "amber" as const,
	cancelled: "red" as const,
};

const deliveryColor = {
	delivered: "green" as const,
	"in-transit": "blue" as const,
	scheduled: "amber" as const,
	cancelled: "red" as const,
};

export default function CustomerDashboard() {
	return (
		<div className="space-y-10">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
				<p className="mt-1 text-gray-600">
					Here&apos;s an overview of your subscriptions and upcoming deliveries.
				</p>
			</div>

			{/* ── Quick Stats ─────────────────────────────────────────── */}
			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{
						label: "Active Plans",
						value: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "active")
							.length,
						icon: "📋",
					},
					{
						label: "Upcoming Deliveries",
						value: MOCK_DELIVERIES.filter(
							(d) => d.status !== "delivered" && d.status !== "cancelled",
						).length,
						icon: "🚚",
					},
					{
						label: "Items Delivered",
						value: MOCK_DELIVERIES.filter(
							(d) => d.status === "delivered",
						).flatMap((d) => d.items).length,
						icon: "✅",
					},
				].map((stat) => (
					<Card key={stat.label}>
						<div className="flex items-center gap-4">
							<span className="text-3xl">{stat.icon}</span>
							<div>
								<p className="text-2xl font-bold text-gray-900">{stat.value}</p>
								<p className="text-sm text-gray-500">{stat.label}</p>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* ── Subscriptions ───────────────────────────────────────── */}
			<section id="subscriptions">
				<h2 className="mb-4 text-xl font-bold text-gray-900">
					My Subscriptions
				</h2>
				<div className="grid gap-4 sm:grid-cols-2">
					{MOCK_SUBSCRIPTIONS.map((sub) => (
						<Card key={sub.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>{sub.plan}</CardTitle>
									<Badge variant={statusColor[sub.status]}>{sub.status}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<dl className="grid grid-cols-2 gap-y-2 text-sm">
									<dt className="text-gray-500">Started</dt>
									<dd className="text-gray-900">{sub.startDate}</dd>
									<dt className="text-gray-500">Next Delivery</dt>
									<dd className="text-gray-900">{sub.nextDelivery}</dd>
								</dl>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* ── Deliveries ──────────────────────────────────────────── */}
			<section id="deliveries">
				<h2 className="mb-4 text-xl font-bold text-gray-900">
					Delivery Status
				</h2>
				<Card>
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
									<th className="pb-3 pr-4">Date</th>
									<th className="pb-3 pr-4">Items</th>
									<th className="pb-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{MOCK_DELIVERIES.map((d) => (
									<tr key={d.id}>
										<td className="py-3 pr-4 text-gray-900">{d.date}</td>
										<td className="py-3 pr-4 text-gray-600">
											{d.items.join(", ")}
										</td>
										<td className="py-3">
											<Badge variant={deliveryColor[d.status]}>
												{d.status}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			</section>
		</div>
	);
}
