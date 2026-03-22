"use client";

interface QuickActionsProps {
	phone?: string;
}

export default function QuickActions({ phone }: QuickActionsProps) {
	const cleanPhone = phone?.replace(/\s/g, "") ?? "";

	return (
		<div className="flex items-center gap-3">
			{cleanPhone && (
				<>
					<a
						href={`tel:${cleanPhone}`}
						className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						📞 Call Us
					</a>
					<a
						href={`https://wa.me/${cleanPhone.replace(/^\+/, "")}`}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
					>
						💬 WhatsApp
					</a>
				</>
			)}
		</div>
	);
}
