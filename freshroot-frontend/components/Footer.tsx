import Link from "next/link";
import { SITE_NAME } from "@/utils/constants";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-green-100 bg-green-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-green-800">🌱 {SITE_NAME}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Farm-fresh organic produce, delivered from our soil to your fork.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/stf" className="hover:text-green-700 transition">
                  Soil to Fork
                </Link>
              </li>
              <li>
                <Link href="/kitchen-garden" className="hover:text-green-700 transition">
                  Kitchen Garden
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-green-700 transition">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>hello@freshrootfarms.com</li>
              <li>+91 98765 43210</li>
              <li>Bengaluru, India</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-gray-800">Follow Us</h4>
            <div className="mt-3 flex gap-4 text-gray-500">
              <span className="cursor-pointer hover:text-green-700 transition">Instagram</span>
              <span className="cursor-pointer hover:text-green-700 transition">Twitter</span>
              <span className="cursor-pointer hover:text-green-700 transition">YouTube</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-green-200 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
