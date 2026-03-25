"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import QuoteForm from "@/components/QuoteForm";

export default function KitchenGardenClient() {
	const [showQuote, setShowQuote] = useState(false);

	return (
		<>
			<section className="bg-gradient-to-t from-green-50 to-white py-12">
				<div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-gray-900">
						Interested? Get a Free Quote
					</h2>
					<p className="mt-3 text-gray-600">
						Tell us about your space and we&apos;ll send you a customized
						estimate within 24 hours.
					</p>
					<div className="mt-8">
						<Button size="lg" onClick={() => setShowQuote(true)}>
							Get Quote
						</Button>
					</div>
				</div>
			</section>

			<Modal
				open={showQuote}
				onClose={() => setShowQuote(false)}
				title="Get a Kitchen Garden Quote"
				className="max-w-lg"
			>
				<QuoteForm onSuccess={() => setShowQuote(false)} />
			</Modal>
		</>
	);
}
