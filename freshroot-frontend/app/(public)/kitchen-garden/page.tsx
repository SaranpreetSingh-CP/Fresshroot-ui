import type { Metadata } from "next";
import { GARDEN_PACKAGES } from "@/utils/mock-data";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import Badge from "@/components/Badge";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Kitchen Garden — Setup & Packages | Freshroot Farms",
  description:
    "Set up your own organic kitchen garden on your balcony, terrace or backyard. We handle design, installation, and maintenance.",
};

export default function KitchenGardenPage() {
  return (
    <>
      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Your Own <span className="text-green-700">Kitchen Garden</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              We design, install, and maintain beautiful organic gardens for
              every space — from tiny balconies to sprawling backyards.
            </p>
          </div>

          {/* ── Package Cards ───────────────────────────────────── */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {GARDEN_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col">
                {/* Placeholder visual */}
                <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-green-100 text-5xl">
                  🌿
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pkg.name}</CardTitle>
                    <Badge variant="green">{pkg.area}</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="mb-3 text-2xl font-extrabold text-gray-900">
                    ₹{pkg.price.toLocaleString("en-IN")}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      one-time
                    </span>
                  </p>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Includes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.plants.map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form ────────────────────────────────────────── */}
      <section id="book" className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Book a Kitchen Garden
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Fill in the form below and our team will get in touch within 24 hours.
          </p>
          <div className="mt-10">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
