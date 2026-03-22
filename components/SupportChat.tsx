"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTicketDetail, useSendMessage } from "@/hooks/useSupport";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { cn } from "@/utils/cn";

interface SupportChatProps {
	ticketId: string;
	onBack: () => void;
}

function formatTime(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

const statusColor: Record<string, "green" | "blue" | "amber" | "gray"> = {
	open: "amber",
	"in-progress": "blue",
	resolved: "green",
	closed: "gray",
};

export default function SupportChat({ ticketId, onBack }: SupportChatProps) {
	const { data: ticket, isLoading } = useTicketDetail(ticketId);
	const sendMessage = useSendMessage(ticketId);
	const [text, setText] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [ticket?.messages]);

	function handleSend(ev: FormEvent) {
		ev.preventDefault();
		const trimmed = text.trim();
		if (!trimmed) return;
		sendMessage.mutate(trimmed, {
			onSuccess: () => setText(""),
		});
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20 text-gray-400">
				Loading ticket…
			</div>
		);
	}

	if (!ticket) {
		return (
			<div className="flex flex-col items-center gap-4 py-20 text-center">
				<span className="text-4xl">📭</span>
				<p className="text-gray-500">Ticket not found.</p>
				<Button variant="outline" onClick={onBack}>
					← Back
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
				<div className="flex items-center gap-3">
					<button
						onClick={onBack}
						className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
					>
						←
					</button>
					<div>
						<p className="text-sm font-semibold text-gray-900">
							{ticket.issueType.replace(/-/g, " ")}
						</p>
						<p className="text-xs text-gray-500">Ticket #{ticket.id}</p>
					</div>
				</div>
				<Badge variant={statusColor[ticket.status] ?? "gray"}>
					{ticket.status}
				</Badge>
			</div>

			{/* Messages */}
			<div
				className="flex-1 space-y-3 overflow-y-auto p-4"
				style={{ maxHeight: 400 }}
			>
				{ticket.messages.length === 0 && (
					<p className="py-8 text-center text-sm text-gray-400">
						No messages yet. Start the conversation below.
					</p>
				)}
				{ticket.messages.map((msg) => (
					<div
						key={msg.id}
						className={cn(
							"flex",
							msg.sender === "customer" ? "justify-end" : "justify-start",
						)}
					>
						<div
							className={cn(
								"max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
								msg.sender === "customer"
									? "bg-green-600 text-white rounded-br-md"
									: "bg-gray-100 text-gray-800 rounded-bl-md",
							)}
						>
							<p>{msg.text}</p>
							<p
								className={cn(
									"mt-1 text-[10px]",
									msg.sender === "customer"
										? "text-green-200"
										: "text-gray-400",
								)}
							>
								{formatTime(msg.createdAt)}
							</p>
						</div>
					</div>
				))}
				<div ref={bottomRef} />
			</div>

			{/* Input */}
			{ticket.status !== "closed" && (
				<form
					onSubmit={handleSend}
					className="flex items-center gap-2 border-t border-gray-200 px-4 py-3"
				>
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Type a message…"
						className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
					/>
					<Button
						type="submit"
						size="sm"
						disabled={sendMessage.isPending || !text.trim()}
					>
						{sendMessage.isPending ? "…" : "Send"}
					</Button>
				</form>
			)}

			{ticket.status === "closed" && (
				<div className="border-t border-gray-200 px-4 py-3 text-center text-sm text-gray-400">
					This ticket has been closed.
				</div>
			)}
		</div>
	);
}
