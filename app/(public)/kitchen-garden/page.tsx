import type { Metadata } from "next";
import KitchenGardenClient from "./KitchenGardenClient";

export const metadata: Metadata = {
	title: "Kitchen Garden — Build Your Own | Freshroot Farms",
	description:
		"Get a customized kitchen garden plan tailored to your space. Fresh organic vegetables at home with expert agronomist support.",
};

const BENEFITS = [
	{
		icon: "🥬",
		title: "Fresh Organic Vegetables",
		description:
			"Grow chemical-free, nutrient-rich produce right at your doorstep.",
	},
	{
		icon: "🔧",
		title: "Fully Managed Setup & Maintenance",
		description:
			"We handle everything — from soil prep and planting to weekly upkeep.",
	},
	{
		icon: "👩‍🌾",
		title: "Expert Agronomist Support",
		description:
			"Dedicated Green Officer visits and senior agronomist guidance throughout.",
	},
	{
		icon: "📐",
		title: "Customized for Your Space",
		description:
			"Whether it's a balcony, terrace, or backyard — we design around what you have.",
	},
];

const GALLERY = [
	{
		src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop",
		alt: "Grow bags on a terrace garden",
		label: "Grow Bag Setup",
	},
	{
		src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
		alt: "Lush terrace vegetable garden",
		label: "Terrace Garden",
	},
	{
		src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
		alt: "Fresh harvested vegetables",
		label: "Fresh Harvest",
	},
];

export default function KitchenGardenPage() {
	return (
		<>
			{/* -- Hero -------------------------------------------------- */}
			<section className="bg-gradient-to-b from-green-50 to-white pt-12 pb-4">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
						Build Your Own Kitchen Garden{" "}
						<span className="inline-block">🌱</span>
					</h1>
					<p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
						Every home is different. Get a customized kitchen garden plan
						tailored to your space — from compact balconies to sprawling
						backyards.
					</p>
				</div>
			</section>

			{/* -- Benefits ---------------------------------------------- */}
			<section className="bg-white">
				<div className="mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
					<h2 className="text-center text-3xl font-bold text-gray-900">
						What You Get
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
						A complete, worry-free kitchen garden experience.
					</p>

					<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{BENEFITS.map((b) => (
							<div
								key={b.title}
								className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-green-200"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl transition group-hover:bg-green-100">
									{b.icon}
								</div>
								<h3 className="mt-4 text-base font-semibold text-gray-900">
									{b.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-gray-500">
									{b.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* -- Gallery ----------------------------------------------- */}
			<section className="bg-gray-50 py-12">
				<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<h2 className="text-center text-3xl font-bold text-gray-900">
						See It in Action
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
						Real setups. Real results.
					</p>

					<div className="mt-12 grid gap-6 sm:grid-cols-3">
						{GALLERY.map((img) => (
							<div
								key={img.label}
								className="group overflow-hidden rounded-2xl shadow-sm"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={img.src}
									alt={img.alt}
									className="aspect-[3/2] w-full object-cover transition group-hover:scale-105"
									loading="lazy"
								/>
								<div className="bg-white px-4 py-3">
									<span className="text-sm font-medium text-gray-700">
										{img.label}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* -- Get Quote CTA + Modal --------------------------------- */}
			<KitchenGardenClient />
		</>
	);
}
