import { cn } from "@/utils/cn";

type BadgeVariant = "green" | "amber" | "red" | "gray" | "blue";

const variants: Record<BadgeVariant, string> = {
	green: "bg-green-100 text-green-800",
	amber: "bg-amber-100 text-amber-800",
	red: "bg-red-100 text-red-800",
	gray: "bg-gray-100 text-gray-800",
	blue: "bg-blue-100 text-blue-800",
};

interface BadgeProps {
	variant?: BadgeVariant;
	children: React.ReactNode;
	className?: string;
}

export default function Badge({
	variant = "gray",
	children,
	className,
}: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
				variants[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}
