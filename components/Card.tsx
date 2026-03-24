import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface CardProps {
	className?: string;
	children: ReactNode;
	highlight?: boolean;
}

export default function Card({ className, children, highlight }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md",
				highlight
					? "border-green-500 ring-2 ring-green-200"
					: "border-gray-200",
				className,
			)}
		>
			{children}
		</div>
	);
}

/* -- Sub-components ----------------------------------------------- */

export function CardHeader({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h3 className={cn("text-lg font-bold text-gray-900", className)}>
			{children}
		</h3>
	);
}

export function CardDescription({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function CardContent({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("mt-6 flex items-center gap-3", className)}>
			{children}
		</div>
	);
}
