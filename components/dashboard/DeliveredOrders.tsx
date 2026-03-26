"use client";

import { useMemo } from "react";
import type { CustomerDeliveredOrder } from "@/utils/types";

function formatDate(iso: string) {
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

interface DeliveredOrdersProps {
	orders: CustomerDeliveredOrder[];
}

/**
 * Delivered orders card with a monthly summary and the last 5 entries.
 */
export default function DeliveredOrders({ orders }: DeliveredOrdersProps) {
	// Sort latest first and limit to 5
	const sorted = useMemo(() => {
		return [...orders]
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	}, [orders]);

	// Total delivered this month
	const monthlyTotal = useMemo(() => {
		const now = new Date();
		const thisMonth = now.getMonth();
		const thisYear = now.getFullYear();
		return orders
			.filter((o) => {
				const d = new Date(o.date);
				return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
			})
			.reduce((sum, o) => sum + o.totalQty, 0);
	}, [orders]);

	return (
		<div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
				<h3 className="text-sm font-semibold text-gray-900">
					Delivered Orders
				</h3>
				{monthlyTotal > 0 && (
					<span className="text-xs text-gray-500">
						This month:{" "}
						<strong className="text-gray-800">{monthlyTotal} kg</strong>
					</span>
				)}
			</div>

			{sorted.length === 0 ? (
				<div className="py-8 text-center">
					<p className="text-3xl">📬</p>
					<p className="mt-2 text-sm text-gray-400">No delivered orders yet</p>
				</div>
			) : (
				<div className="divide-y divide-gray-100">
					{sorted.map((o) => (
						<div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
							<div className="flex-shrink-0 w-20">
								<p className="text-sm font-medium text-gray-800">
									{formatDate(o.date)}
								</p>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-gray-600 truncate">
									{formatItems(o.items)}
								</p>
							</div>
							<div className="flex-shrink-0 text-right">
								<p className="text-sm font-semibold text-gray-900 tabular-nums">
									{o.totalQty}
									<span className="text-xs font-normal text-gray-400 ml-0.5">
										kg
									</span>
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
