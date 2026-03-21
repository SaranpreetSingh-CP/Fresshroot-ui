export const SITE_NAME = "Freshroot Farms";
export const SITE_DESCRIPTION =
	"Farm-fresh organic produce delivered from soil to your fork. Grow your own kitchen garden with our expert guidance.";

export const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Soil to Fork", href: "/stf" },
	{ label: "Kitchen Garden", href: "/kitchen-garden" },
] as const;

export const DASHBOARD_NAV = {
	customer: [
		{ label: "Overview", href: "/dashboard/customer" },
		{ label: "Subscriptions", href: "/dashboard/customer#subscriptions" },
		{ label: "Deliveries", href: "/dashboard/customer#deliveries" },
	],
	admin: [
		{ label: "Overview", href: "/dashboard/admin" },
		{ label: "Customers", href: "/dashboard/admin#customers" },
		{ label: "Orders", href: "/dashboard/admin#orders" },
		{ label: "Expenses", href: "/dashboard/admin#expenses" },
	],
} as const;
