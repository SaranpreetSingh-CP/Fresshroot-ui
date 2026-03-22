"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/utils/cn";

interface Testimonial {
	id: string;
	name: string;
	role: string;
	quote: string;
}

interface TestimonialCarouselProps {
	testimonials: readonly Testimonial[];
	/** Auto-advance interval in ms (default 5000) */
	interval?: number;
}

export default function TestimonialCarousel({
	testimonials,
	interval = 5000,
}: TestimonialCarouselProps) {
	const [current, setCurrent] = useState(0);
	const total = testimonials.length;

	const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);

	const prev = useCallback(
		() => setCurrent((i) => (i - 1 + total) % total),
		[total],
	);

	// Auto-advance
	useEffect(() => {
		const timer = setInterval(next, interval);
		return () => clearInterval(timer);
	}, [next, interval]);

	const t = testimonials[current];

	return (
		<div className="relative mx-auto max-w-2xl">
			{/* Card */}
			<blockquote
				key={t.id}
				className="rounded-2xl border border-gray-100 bg-gray-50 px-10 py-8 text-center transition-opacity duration-500"
			>
				<p className="text-base leading-relaxed text-gray-600">
					&ldquo;{t.quote}&rdquo;
				</p>
				<footer className="mt-6">
					<p className="font-semibold text-gray-900">{t.name}</p>
					<p className="text-xs text-gray-500">{t.role}</p>
				</footer>
			</blockquote>

			{/* Arrows */}
			<button
				type="button"
				onClick={prev}
				aria-label="Previous testimonial"
				className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
			>
				‹
			</button>
			<button
				type="button"
				onClick={next}
				aria-label="Next testimonial"
				className="absolute right-0 top-1/2 translate-x-12 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
			>
				›
			</button>

			{/* Dots */}
			<div className="mt-6 flex justify-center gap-2">
				{testimonials.map((_, i) => (
					<button
						key={testimonials[i].id}
						type="button"
						aria-label={`Go to testimonial ${i + 1}`}
						onClick={() => setCurrent(i)}
						className={cn(
							"h-2.5 rounded-full transition-all duration-300",
							i === current
								? "w-6 bg-green-600"
								: "w-2.5 bg-gray-300 hover:bg-gray-400",
						)}
					/>
				))}
			</div>
		</div>
	);
}
