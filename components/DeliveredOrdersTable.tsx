"use client";

import Card, { CardHeader, CardTitle } from "@/components/Card";
import type { CustomerDeliveredOrder } from "@/utils/types";

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "2-digit",
		month: "short",
	});
}

function formatItems(items: CustomerDeliveredOrder["items"]): string {
	return items
		.map((i) => `${i.vegetableName} ${i.quantity}${i.unit}`)
		.join(", ");
}

interface DeliveredOrdersTableProps {
	orders: CustomerDeliveredOrder[];
}

export default function DeliveredOrdersTable({
	orders,
}: DeliveredOrdersTableProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Delivered Orders</CardTitle>
			</CardHeader>

			{orders.length === 0 ? (
				<p className="py-6 text-center text-sm text-gray-400">
					No delivered orders yet.
				</p>
			) : (
				<div className="overflow-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
								<th className="pb-3 pr-4">Date</th>
								<th className="pb-3 pr-4">Items</th>
								<th className="pb-3 text-right">Total Qty</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{orders.map((o) => (
								<tr key={o.id}>
									<td className="py-3 pr-4 whitespace-nowrap font-medium text-gray-700">
										{formatDate(o.date)}
									</td>
									<td className="py-3 pr-4 text-gray-600">
										{formatItems(o.items)}
									</td>
									<td className="py-3 text-right font-semibold text-gray-900 tabular-nums">
										{o.totalQty}
										<span className="text-xs font-normal text-gray-400">
											kg
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Card>
	);
}
