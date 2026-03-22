"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

/* ── Types ──────────────────────────────────────────────────────── */
type ToastVariant = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	variant: ToastVariant;
}

interface ToastContextValue {
	toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
	return ctx;
}

/* ── Variant styles ─────────────────────────────────────────────── */
const variantStyles: Record<ToastVariant, string> = {
	success: "bg-green-600 text-white",
	error: "bg-red-600 text-white",
	info: "bg-blue-600 text-white",
};

const icons: Record<ToastVariant, string> = {
	success: "✓",
	error: "✕",
	info: "ℹ",
};

/* ── Provider ───────────────────────────────────────────────────── */
let nextId = 0;

export default function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback(
		(message: string, variant: ToastVariant = "success") => {
			const id = ++nextId;
			setToasts((prev) => [...prev, { id, message, variant }]);
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 3500);
		},
		[],
	);

	const removeToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast: addToast }}>
			{children}

			{/* Toast container */}
			<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
				{toasts.map((t) => (
					<div
						key={t.id}
						className={cn(
							"flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg animate-slide-in-right",
							variantStyles[t.variant],
						)}
					>
						<span className="text-base font-bold">{icons[t.variant]}</span>
						<span className="flex-1">{t.message}</span>
						<button
							onClick={() => removeToast(t.id)}
							className="ml-2 opacity-70 hover:opacity-100 transition"
						>
							✕
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}
