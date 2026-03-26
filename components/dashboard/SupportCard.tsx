"use client";

interface SupportCardProps {
	phone?: string;
	onReportIssue?: () => void;
}

export default function SupportCard({
	phone,
	onReportIssue,
}: SupportCardProps) {
	const cleanPhone = phone?.replace(/\s/g, "") ?? "";

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
			<h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
				Need Help?
			</h3>

			<div className="space-y-2">
				{cleanPhone && (
					<>
						<a
							href={`tel:${cleanPhone}`}
							className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
						>
							<span className="text-lg">📞</span>
							Call Us
						</a>
						<a
							href={`https://wa.me/${cleanPhone.replace(/^\+/, "")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition"
						>
							<span className="text-lg">💬</span>
							WhatsApp
						</a>
					</>
				)}
				{onReportIssue && (
					<button
						onClick={onReportIssue}
						className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100 transition"
					>
						<span className="text-lg">🚨</span>
						Report Issue
					</button>
				)}
			</div>
		</div>
	);
}
