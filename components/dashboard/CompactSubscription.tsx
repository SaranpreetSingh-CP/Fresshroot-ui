"use client";

import Badge from "@/components/Badge";
import type { DashboardSubscription } from "@/utils/types";

const statusColor = {
	active: "green" as const,
	paused: "amber" as const,
	cancelled: "red" as const,
};

interface CompactSubscriptionProps {
	subscriptions: DashboardSubscription[];
}

/**
 * Compact sidebar card showing subscriptions.
 */
export default function CompactSubscription({
	subscriptions,
}: CompactSubscriptionProps) {
	if (subscriptions.length === 0) {
		return (
			<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
					Subscription
				</h3>
				<p className="mt-3 text-sm text-gray-400 italic">
					No active subscriptions
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
			<h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
				Subscription
			</h3>

			{subscriptions.map((sub) => (
				<div key={`${sub.name}-${sub.startDate}`} className="space-y-2">
					<div className="flex items-center justify-between gap-2">
						<p className="text-sm font-semibold text-gray-900 truncate">
							{sub.name}
						</p>
						<Badge variant={statusColor[sub.status]}>{sub.status}</Badge>
					</div>
					<dl className="grid grid-cols-2 gap-y-1 text-xs">
						<dt className="text-gray-400">Started</dt>
						<dd className="text-gray-700">{sub.startDate}</dd>
						<dt className="text-gray-400">Next Delivery</dt>
						<dd className="text-gray-700">{sub.nextDelivery}</dd>
					</dl>
				</div>
			))}
		</div>
	);
}
