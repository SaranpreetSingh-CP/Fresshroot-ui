"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getLeads,
	createLead,
	updateLeadStatus,
} from "@/services/lead.service";
import type { LeadFormData, LeadStatus } from "@/utils/types";

/** Fetch all leads (admin) */
export function useLeads() {
	return useQuery({
		queryKey: ["leads"],
		queryFn: getLeads,
		staleTime: 1000 * 60 * 2,
	});
}

/** Submit a new quote / lead */
export function useCreateLead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: LeadFormData) => createLead(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["leads"] });
		},
	});
}

/** Update lead status (admin) */
export function useUpdateLeadStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
			updateLeadStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["leads"] });
		},
	});
}
