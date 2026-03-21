import type { Metadata } from "next";
import {
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_EXPENSES,
} from "@/utils/mock-data";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";

export const metadata: Metadata = {
  title: "Admin Dashboard | Freshroot Farms",
};

const orderStatusColor = {
  pending: "amber" as const,
  processing: "blue" as const,
  delivered: "green" as const,
  cancelled: "red" as const,
};

export default function AdminDashboard() {
  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
  const totalExpenses = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Manage customers, orders, and financials.
        </p>
      </div>

      {/* ── Quick Stats ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Customers", value: MOCK_CUSTOMERS.length, icon: "👥" },
          { label: "Active", value: MOCK_CUSTOMERS.filter((c) => c.status === "active").length, icon: "✅" },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰" },
          { label: "Expenses", value: `₹${totalExpenses.toLocaleString("en-IN")}`, icon: "📊" },
        ].map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Customer List ───────────────────────────────────────── */}
      <section id="customers">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Plan</th>
                  <th className="pb-3 pr-4">Joined</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_CUSTOMERS.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {c.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{c.email}</td>
                    <td className="py-3 pr-4 text-gray-600">{c.plan}</td>
                    <td className="py-3 pr-4 text-gray-600">{c.joinedDate}</td>
                    <td className="py-3">
                      <Badge
                        variant={c.status === "active" ? "green" : "gray"}
                      >
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ── Orders Table ────────────────────────────────────────── */}
      <section id="orders">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {o.id}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {o.customerName}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {o.items.join(", ")}
                    </td>
                    <td className="py-3 pr-4 text-gray-900">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{o.date}</td>
                    <td className="py-3">
                      <Badge variant={orderStatusColor[o.status]}>
                        {o.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ── Expense Tracker ─────────────────────────────────────── */}
      <section id="expenses">
        <Card>
          <CardHeader>
            <CardTitle>Expense Tracker</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_EXPENSES.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 pr-4">
                      <Badge variant="gray">{e.category}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {e.description}
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      ₹{e.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-gray-600">{e.date}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200">
                  <td
                    colSpan={2}
                    className="pt-3 text-right font-semibold text-gray-700"
                  >
                    Total
                  </td>
                  <td className="pt-3 font-bold text-gray-900">
                    ₹{totalExpenses.toLocaleString("en-IN")}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
