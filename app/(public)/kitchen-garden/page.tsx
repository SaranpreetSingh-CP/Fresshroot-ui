import type { Metadata } from "next";
import { GARDEN_PACKAGES } from "@/utils/mock-data";
import type { GardenPackage } from "@/utils/types";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
	title: "Kitchen Garden — Setup & Packages | Freshroot Farms",
	description:
		"Set up your own organic kitchen garden with grow bags or on your land. Professional setup, maintenance and agronomist guidance.",
};

const formatPrice = (v: number) => `₹${v.toLocaleString("en-IN")}`;

function PackageTable({ pkg }: { pkg: GardenPackage }) {
	const hasSetupCost = pkg.tiers.some((t) => t.setupCost != null);
	const hasWeekendPrice = pkg.tiers.some((t) => t.weekendPrice != null);

	return (
		<div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
			{/* Package title */}
			<div className="flex items-center gap-3 bg-gradient-to-r from-green-700 to-green-600 px-6 py-4">
				<span className="text-2xl">🌱</span>
				<h3 className="text-lg font-bold text-white">{pkg.name}</h3>
			</div>

			{/* Pricing table */}
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-200 bg-gray-50">
							<th className="px-5 py-3 text-left font-semibold text-gray-700">
								Particulars
							</th>
							{pkg.tiers.map((t) => (
								<th
									key={t.label}
									className="px-5 py-3 text-center font-semibold text-gray-700"
								>
									{t.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{hasSetupCost && (
							<tr className="hover:bg-green-50/30 transition">
								<td className="px-5 py-3 font-medium text-gray-600">
									Setup Cost
								</td>
								{pkg.tiers.map((t) => (
									<td
										key={t.label}
										className="px-5 py-3 text-center font-medium text-gray-900"
									>
										{t.setupCost != null ? formatPrice(t.setupCost) : "—"}
									</td>
								))}
							</tr>
						)}
						<tr className="hover:bg-green-50/30 transition">
							<td className="px-5 py-3 font-medium text-gray-600">
								Tentative Production (Per Crop Cycle)
							</td>
							{pkg.tiers.map((t) => (
								<td
									key={t.label}
									className="px-5 py-3 text-center text-gray-900"
								>
									{t.production}
								</td>
							))}
						</tr>
						<tr className="hover:bg-green-50/30 transition">
							<td className="px-5 py-3 font-medium text-gray-600">
								Weekday Price
							</td>
							{pkg.tiers.map((t) => (
								<td
									key={t.label}
									className="px-5 py-3 text-center font-medium text-gray-900"
								>
									{formatPrice(t.weekdayPrice)}
								</td>
							))}
						</tr>
						{hasWeekendPrice && (
							<tr className="hover:bg-green-50/30 transition">
								<td className="px-5 py-3 font-medium text-gray-600">
									Weekend Price
								</td>
								{pkg.tiers.map((t) => (
									<td
										key={t.label}
										className="px-5 py-3 text-center font-medium text-gray-900"
									>
										{t.weekendPrice != null ? formatPrice(t.weekendPrice) : "—"}
									</td>
								))}
							</tr>
						)}
						<tr className="hover:bg-green-50/30 transition">
							<td className="px-5 py-3 font-medium text-gray-600">
								Inclusions
							</td>
							<td
								colSpan={pkg.tiers.length}
								className="px-5 py-3 text-gray-700 leading-relaxed"
							>
								{pkg.inclusions}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default function KitchenGardenPage() {
	return (
		<>
			{/* ── Header ──────────────────────────────────────────────── */}
			<section className="bg-gradient-to-b from-green-50 to-white py-20">
				<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="text-4xl font-extrabold text-gray-900">
							Kitchen Garden <span className="text-green-700">Packages</span>
						</h1>
						<p className="mx-auto mt-4 max-w-2xl text-gray-600">
							Professional garden setup and 4-month maintenance with weekly
							Green Officer visits and agronomist guidance.
						</p>
					</div>

					{/* ── Package Tables ──────────────────────────────────── */}
					<div className="mt-16 space-y-12">
						{GARDEN_PACKAGES.map((pkg) => (
							<PackageTable key={pkg.id} pkg={pkg} />
						))}
					</div>

					{/* Bottom note */}
					<p className="mt-10 text-center text-sm italic text-gray-500">
						*We execute land projects from 0.5 acres upward, offering customized
						cost estimates.
					</p>
				</div>
			</section>

			{/* ── Booking Form ────────────────────────────────────────── */}
			<section id="book" className="bg-white py-20">
				<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
					<h2 className="text-center text-3xl font-bold text-gray-900">
						Book a Kitchen Garden
					</h2>
					<p className="mt-2 text-center text-gray-600">
						Fill in the form below and our team will get in touch within 24
						hours.
					</p>
					<div className="mt-10">
						<BookingForm />
					</div>
				</div>
			</section>
		</>
	);
}
