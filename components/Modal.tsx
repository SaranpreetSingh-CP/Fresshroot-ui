"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	className?: string;
}

export default function Modal({
	open,
	onClose,
	title,
	children,
	className,
}: ModalProps) {
	// Close on Escape
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Panel */}
			<div
				className={cn(
					"relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col",
					className,
				)}
			>
				<div className="mb-4 flex items-center justify-between flex-shrink-0 px-6 pt-6">
					<h2 className="text-lg font-bold text-gray-900">{title}</h2>
					<button
						onClick={onClose}
						className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
					>
						✕
					</button>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
					{children}
				</div>
			</div>
		</div>
	);
}
