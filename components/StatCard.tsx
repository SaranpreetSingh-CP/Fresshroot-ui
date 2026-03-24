import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface StatCardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
	/** Tailwind color classes for the icon background */
	iconBg?: string;
	/** Optional badge rendered next to the title */
	badge?: ReactNode;
	className?: string;
}

export default function StatCard({
	title,
	value,
	icon,
	iconBg = "bg-gray-100 text-gray-600",
	badge,
	className,
}: StatCardProps) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md",
				className,
			)}
		>
			<div className="flex items-center gap-4">
				<div
					className={cn(
						"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg",
						iconBg,
					)}
				>
					{icon}
				</div>
				<div className="min-w-0">
					<p className="text-2xl font-bold text-gray-900 tabular-nums">
						{value}
					</p>
					<p className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
						{title}
						{badge}
					</p>
				</div>
			</div>
		</div>
	);
}
