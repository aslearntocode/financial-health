'use client'

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white/90">About Us</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white/90">Careers</Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white/90">Press</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="hover:text-white/90">FAQ</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white/90">Blog</Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white/90">Investment Guides</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white/90">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white/90">Terms of Service</Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white/90">Security</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@financialhealth.co.in" className="hover:text-white/90">
                  support@financialhealth.co.in
                </a>
              </li>
              <li>
                <a href="tel:+919321314553" className="hover:text-white/90">
                  +91 93213 14553
                </a>
              </li>
              <li>
                <address className="not-italic">
                  Mumbai 400012<br />
                  India
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Investment Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 