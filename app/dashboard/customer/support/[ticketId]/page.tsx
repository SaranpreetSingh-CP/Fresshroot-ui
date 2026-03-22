"use client";

import { useParams, useRouter } from "next/navigation";
import SupportChat from "@/components/SupportChat";

export default function TicketDetailPage() {
	const params = useParams<{ ticketId: string }>();
	const router = useRouter();

	return (
		<SupportChat
			ticketId={params.ticketId}
			onBack={() => router.push("/dashboard/customer")}
		/>
	);
}
