import Card from "@/components/Card";

interface CustomerInfo {
	id: number | string;
	name: string;
	email?: string | null;
	phone?: string | null;
	address?: string | null;
	createdAt?: string;
}

function formatDate(raw: string): string {
	return new Date(raw).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

interface CustomerInfoCardProps {
	customer: CustomerInfo;
}

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
	const fields: { label: string; value: string }[] = [
		{ label: "Name", value: customer.name },
		{ label: "Email", value: customer.email ?? "—" },
		{ label: "Phone", value: customer.phone ?? "—" },
		{ label: "Address", value: customer.address ?? "—" },
		{
			label: "Joined",
			value: customer.createdAt ? formatDate(customer.createdAt) : "—",
		},
	];

	return (
		<Card>
			<h2 className="mb-4 text-lg font-bold text-gray-900">Customer Details</h2>
			<dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
				{fields.map(({ label, value }) => (
					<div key={label}>
						<dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
							{label}
						</dt>
						<dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
					</div>
				))}
			</dl>
		</Card>
	);
}
