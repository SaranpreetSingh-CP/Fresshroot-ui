"use client";

import { useLeads, useUpdateLeadStatus } from "@/hooks/useLeads";
import LeadTable from "@/components/LeadTable";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { DashboardSkeleton } from "@/components/Skeleton";
import type { LeadStatus } from "@/utils/types";
import Link from "next/link";

export default function AdminLeadsPage() {
	const { data: leads, isLoading, isError } = useLeads();
	const updateStatus = useUpdateLeadStatus();
	const { toast } = useToast();

	function handleStatusChange(id: string, status: LeadStatus) {
		updateStatus.mutate(
			{ id, status },
			{
				onSuccess: () => toast(`Lead marked as ${status}`, "success"),
				onError: (err) =>
					toast(
						err instanceof Error ? err.message : "Failed to update status",
						"error",
					),
			},
		);
	}

	if (isLoading) return <DashboardSkeleton />;

	if (isError) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-red-500">Failed to load leads.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Leads</h1>
					<p className="mt-1 text-sm text-gray-500">
						Kitchen garden quote requests from the website.
					</p>
				</div>
				<Link
					href="/dashboard/admin"
					className="text-sm text-green-700 hover:underline"
				>
					← Back to Admin
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Leads ({leads?.length ?? 0})</CardTitle>
				</CardHeader>
				<LeadTable
					data={leads ?? []}
					onStatusChange={handleStatusChange}
					isUpdating={updateStatus.isPending}
				/>
			</Card>
		</div>
	);
}
