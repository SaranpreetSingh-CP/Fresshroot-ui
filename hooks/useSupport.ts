"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createTicket,
	getTickets,
	getTicketDetail,
	sendMessage,
	type CreateTicketPayload,
	type SupportTicket,
	type TicketDetail,
	type TicketMessage,
} from "@/services/support.service";

/** List the user's support tickets */
export function useTickets() {
	return useQuery<SupportTicket[]>({
		queryKey: ["supportTickets"],
		queryFn: getTickets,
		staleTime: 1000 * 60 * 2,
	});
}

/** Get a single ticket with its chat messages */
export function useTicketDetail(id: string) {
	return useQuery<TicketDetail>({
		queryKey: ["supportTicket", id],
		queryFn: () => getTicketDetail(id),
		enabled: !!id,
		refetchInterval: 10_000, // poll for new messages every 10s
	});
}

/** Create a support ticket */
export function useCreateTicket() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTicketPayload) => createTicket(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["supportTickets"] });
		},
	});
}

/** Send a message on a ticket */
export function useSendMessage(ticketId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (text: string) => sendMessage(ticketId, text),
		onSuccess: (newMsg: TicketMessage) => {
			// Optimistically append the message to the cache
			qc.setQueryData<TicketDetail>(["supportTicket", ticketId], (old) => {
				if (!old) return old;
				return { ...old, messages: [...old.messages, newMsg] };
			});
		},
	});
}
