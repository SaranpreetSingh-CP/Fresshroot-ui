"use client";

import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	BarChart,
	Bar,
	Cell,
} from "recharts";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import { Skeleton } from "@/components/Skeleton";
import type { TrendDataPoint, TopVegetable } from "@/utils/types";

/* -- Trend Line Chart --------------------------------------------- */

interface TrendChartProps {
	data: TrendDataPoint[];
	isLoading?: boolean;
}

function formatDateLabel(raw: string): string {
	const d = new Date(raw);
	return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function TrendChart({ data, isLoading }: TrendChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Order Trend (Last 7 Days)</CardTitle>
			</CardHeader>

			{isLoading ? (
				<div className="space-y-3">
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-52 w-full rounded-xl" />
				</div>
			) : data.length === 0 ? (
				<p className="py-12 text-center text-sm text-gray-400">
					No trend data available.
				</p>
			) : (
				<div className="h-64 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={data}
							margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f3f4f6"
								vertical={false}
							/>
							<XAxis
								dataKey="date"
								tickFormatter={formatDateLabel}
								tick={{ fontSize: 12, fill: "#9ca3af" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								allowDecimals={false}
								tick={{ fontSize: 12, fill: "#9ca3af" }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								labelFormatter={(label) => formatDateLabel(String(label))}
								contentStyle={{
									borderRadius: 12,
									border: "1px solid #e5e7eb",
									fontSize: 13,
								}}
							/>
							<Line
								type="monotone"
								dataKey="total"
								name="Orders"
								stroke="#16a34a"
								strokeWidth={2.5}
								dot={{ r: 4, fill: "#16a34a" }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</Card>
	);
}

/* -- Top Vegetables Bar Chart ------------------------------------- */

const BAR_COLORS = [
	"#16a34a",
	"#22c55e",
	"#4ade80",
	"#86efac",
	"#bbf7d0",
	"#d1fae5",
	"#a7f3d0",
	"#6ee7b7",
	"#34d399",
	"#10b981",
];

interface TopVegetablesChartProps {
	data: TopVegetable[];
	isLoading?: boolean;
}

export function TopVegetablesChart({
	data,
	isLoading,
}: TopVegetablesChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Vegetables</CardTitle>
			</CardHeader>

			{isLoading ? (
				<div className="space-y-3">
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-52 w-full rounded-xl" />
				</div>
			) : data.length === 0 ? (
				<p className="py-12 text-center text-sm text-gray-400">
					No vegetable data available.
				</p>
			) : (
				<div className="h-64 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							layout="vertical"
							margin={{ top: 4, right: 24, bottom: 0, left: 0 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f3f4f6"
								horizontal={false}
							/>
							<XAxis
								type="number"
								allowDecimals={false}
								tick={{ fontSize: 12, fill: "#9ca3af" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								type="category"
								dataKey="vegetableName"
								width={100}
								tick={{ fontSize: 12, fill: "#374151" }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: 12,
									border: "1px solid #e5e7eb",
									fontSize: 13,
								}}
							/>
							<Bar
								dataKey="totalQty"
								name="Quantity"
								radius={[0, 6, 6, 0]}
								barSize={22}
							>
								{data.map((_, i) => (
									<Cell
										key={`cell-${i}`}
										fill={BAR_COLORS[i % BAR_COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</Card>
	);
}
