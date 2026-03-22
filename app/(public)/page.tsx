import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/utils/constants";
import { TESTIMONIALS } from "@/utils/mock-data";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export const metadata: Metadata = {
	title: `${SITE_NAME} — Farm Fresh, From Soil to Fork`,
	description: SITE_DESCRIPTION,
};

/* ================================================================
   Landing Page  –  Server Component (SEO-friendly)
   ================================================================ */
export default function HomePage() {
	return (
		<>
			{/* ── Hero ─────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50">
				<div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
					<div className="max-w-3xl">
						<span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-800">
							100 % Organic &amp; Sustainable
						</span>
						<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
							Farm Fresh Goodness,
							<br />
							<span className="text-green-700">Straight to Your Table</span>
						</h1>
						<p className="mt-6 max-w-xl text-lg text-gray-600">
							{SITE_DESCRIPTION}
						</p>
						<div className="mt-8 flex flex-wrap gap-4">
							<Link
								href="/stf"
								className="rounded-full bg-green-700 px-7 py-3 text-sm font-semibold text-white shadow transition hover:bg-green-800"
							>
								Explore Subscriptions
							</Link>
							<Link
								href="/kitchen-garden"
								className="rounded-full border-2 border-green-700 px-7 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
							>
								Start a Kitchen Garden
							</Link>
						</div>
					</div>
				</div>

				{/* Decorative circles */}
				<div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-green-200/30" />
				<div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-amber-200/30" />
			</section>

			{/* ── Soil to Fork Section ─────────────────────────────────── */}
			<section className="bg-white py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-gray-900">
							Soil to Fork <span className="text-green-700">(STF)</span>
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-gray-600">
							Subscribe to weekly or bi-weekly deliveries of freshly harvested,
							chemical-free vegetables and fruits grown at our organic farms.
						</p>
					</div>

					<div className="mt-12 grid gap-8 sm:grid-cols-3">
						{[
							{
								icon: "🌾",
								title: "Organic Farming",
								desc: "No pesticides, no chemicals — just nature's finest produce nurtured with care.",
							},
							{
								icon: "📦",
								title: "Flexible Plans",
								desc: "Choose Starter, Family, or Premium plans that suit your household needs.",
							},
							{
								icon: "🚚",
								title: "Farm-to-Door Delivery",
								desc: "Harvested and dispatched within 24 hours so you get peak freshness.",
							},
						].map((item) => (
							<div
								key={item.title}
								className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:shadow-md"
							>
								<span className="text-4xl">{item.icon}</span>
								<h3 className="mt-4 text-lg font-semibold text-gray-900">
									{item.title}
								</h3>
								<p className="mt-2 text-sm text-gray-600">{item.desc}</p>
							</div>
						))}
					</div>

					<div className="mt-10 text-center">
						<Link
							href="/stf"
							className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 transition hover:text-green-900"
						>
							View all plans →
						</Link>
					</div>
				</div>
			</section>

			{/* ── Kitchen Garden Section ───────────────────────────────── */}
			<section className="bg-green-50 py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div>
							<h2 className="text-3xl font-bold text-gray-900">
								Your Own <span className="text-green-700">Kitchen Garden</span>
							</h2>
							<p className="mt-4 text-gray-600">
								Don&apos;t just eat fresh — grow fresh! We design, set up, and
								maintain kitchen gardens on your balcony, terrace, or backyard.
								From soil preparation to harvest guidance, we handle everything.
							</p>
							<ul className="mt-6 space-y-3 text-sm text-gray-700">
								{[
									"Custom garden design for any space",
									"Organic soil, compost & drip irrigation setup",
									"Seasonal planting calendar included",
									"Ongoing maintenance packages available",
								].map((item) => (
									<li key={item} className="flex items-start gap-2">
										<span className="mt-0.5 text-green-600">✓</span>
										{item}
									</li>
								))}
							</ul>
							<Link
								href="/kitchen-garden"
								className="mt-8 inline-block rounded-full bg-green-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
							>
								Explore Packages
							</Link>
						</div>
						<div className="flex items-center justify-center rounded-2xl bg-green-200/40 p-12 text-center">
							<div>
								<span className="text-7xl">🌿</span>
								<p className="mt-4 text-sm text-green-800 font-medium">
									Grow your own greens at home
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Testimonials ─────────────────────────────────────────── */}
			<section className="bg-white py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h2 className="text-center text-3xl font-bold text-gray-900">
						What Our Customers Say
					</h2>
					<div className="mt-12">
						<TestimonialCarousel testimonials={TESTIMONIALS} />
					</div>
				</div>
			</section>

			{/* ── CTA ──────────────────────────────────────────────────── */}
			<section className="bg-green-700 py-20 text-center text-white">
				<div className="mx-auto max-w-3xl px-4">
					<h2 className="text-3xl font-bold">Ready to Go Fresh?</h2>
					<p className="mt-4 text-green-100">
						Join hundreds of families who already enjoy chemical-free,
						farm-fresh produce every week. Start your journey today.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<Link
							href="/stf"
							className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
						>
							Subscribe Now
						</Link>
						<Link
							href="/kitchen-garden"
							className="rounded-full border-2 border-white px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
						>
							Book a Kitchen Garden
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
