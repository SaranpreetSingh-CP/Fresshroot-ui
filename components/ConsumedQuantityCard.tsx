"use client";

import Card, { CardHeader, CardTitle } from "@/components/Card";
import type { ConsumedQuantity } from "@/utils/types";

interface ConsumedQuantityCardProps {
	consumed: ConsumedQuantity;
}

export default function ConsumedQuantityCard({
	consumed,
}: ConsumedQuantityCardProps) {
	const pieceEntries = Object.entries(consumed.pieces ?? {});
	const totalPieces = pieceEntries.reduce((sum, [, qty]) => sum + qty, 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Consumed Quantity</CardTitle>
			</CardHeader>

			<div className="px-5 pb-5">
				{/* Summary stats */}
				<div className="grid grid-cols-2 gap-4">
					{/* Kg block */}
					<div className="rounded-xl bg-green-50 p-4 text-center">
						<p className="text-3xl font-bold text-green-700 tabular-nums">
							{consumed.kg}
							<span className="ml-1 text-base font-medium text-green-500">
								kg
							</span>
						</p>
						<p className="mt-1 text-xs text-green-600">Total weight consumed</p>
					</div>

					{/* Pieces block */}
					<div className="rounded-xl bg-blue-50 p-4 text-center">
						<p className="text-3xl font-bold text-blue-700 tabular-nums">
							{totalPieces}
							<span className="ml-1 text-base font-medium text-blue-500">
								pcs
							</span>
						</p>
						<p className="mt-1 text-xs text-blue-600">Total pieces consumed</p>
					</div>
				</div>

				{/* Piece-wise breakdown */}
				{pieceEntries.length > 0 && (
					<div className="mt-4">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
							Piece-wise Breakdown
						</p>
						<div className="flex flex-wrap gap-2">
							{pieceEntries.map(([name, qty]) => (
								<span
									key={name}
									className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
								>
									{name}
									<span className="font-bold text-gray-900">{qty}</span>
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
