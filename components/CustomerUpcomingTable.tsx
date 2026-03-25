"use client";

import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import { cn } from "@/utils/cn";
import type { CustomerUpcomingDelivery } from "@/utils/types";

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "2-digit",
		month: "short",
	});
}

function formatItems(items: CustomerUpcomingDelivery["items"]): string {
	return items
		.map((i) => `${i.vegetableName} ${i.quantity}${i.unit}`)
		.join(", ");
}

const STATUS_COLOR: Record<string, "green" | "blue" | "amber" | "gray"> = {
	scheduled: "blue",
	"in-transit": "amber",
	"out-for-delivery": "green",
	skipped: "gray",
};

interface UpcomingDeliveriesTableProps {
	deliveries: CustomerUpcomingDelivery[];
	onEdit?: (delivery: CustomerUpcomingDelivery) => void;
	onSkip?: (delivery: CustomerUpcomingDelivery) => void;
	isSkipping?: boolean;
}

export default function CustomerUpcomingTable({
	deliveries,
	onEdit,
	onSkip,
	isSkipping,
}: UpcomingDeliveriesTableProps) {
	const limited = deliveries.slice(0, 4);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upcoming Deliveries</CardTitle>
			</CardHeader>

			{limited.length === 0 ? (
				<p className="py-6 text-center text-sm text-gray-400">
					No upcoming deliveries.
				</p>
			) : (
				<div className="overflow-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
								<th className="pb-3 pr-4">Date</th>
								<th className="pb-3 pr-4">Items</th>
								<th className="pb-3 pr-4">Status</th>
								<th className="pb-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{limited.map((d) => {
								const isSkipped = d.status === "skipped";
								return (
									<tr key={d.id} className={cn(isSkipped && "opacity-50")}>
										<td className="py-3 pr-4 whitespace-nowrap font-medium text-gray-700">
											{formatDate(d.date)}
										</td>
										<td className="py-3 pr-4 text-gray-600">
											{d.items.length > 0
												? formatItems(d.items)
												: "No items yet"}
										</td>
										<td className="py-3 pr-4">
											<Badge variant={STATUS_COLOR[d.status] ?? "gray"}>
												{d.status
													.replace(/-/g, " ")
													.replace(/\b\w/g, (c) => c.toUpperCase())}
											</Badge>
										</td>
										<td className="py-3 text-right">
											{!isSkipped && (
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={() => onEdit?.(d)}
														className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition"
													>
														✏️ Edit
													</button>
													<button
														disabled={isSkipping}
														onClick={() => onSkip?.(d)}
														className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
													>
														⏭️ Skip
													</button>
												</div>
											)}
											{isSkipped && (
												<span className="text-xs text-gray-400 italic">
													Skipped
												</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</Card>
	);
}
