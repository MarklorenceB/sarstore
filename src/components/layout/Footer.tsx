'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Globe, Share2, CreditCard, Wallet } from 'lucide-react'
import { STORE_INFO, FOOTER_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <>
      {/* Mobile Footer */}
      <footer className="md:hidden bg-white border-t border-gray-200 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Store Info */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🛒</span>
                <h3 className="font-bold text-xl text-primary-600 font-display">
                  {STORE_INFO.name}
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {STORE_INFO.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {STORE_INFO.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {STORE_INFO.email}
                </p>
              </div>
            </div>

            {/* Account Links */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Account</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.account.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Center */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Help Center</h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.help.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Desktop Footer - Matches mockup 6-col layout */}
      <footer className="hidden md:block bg-slate-50 w-full mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 px-8 py-12 max-w-screen-2xl mx-auto">
          {/* Brand */}
          <div className="col-span-2">
            <span className="text-xl font-bold text-slate-900 mb-4 block font-display">Sari-Store</span>
            <p className="text-slate-500 text-sm max-w-xs mb-6">Your neighborhood market, reimagined for the digital age. Curating the best for your home.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-green-100 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4 text-slate-600" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-green-100 transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4 text-slate-600" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Store Locator</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Delivery Info</a></li>
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Returns</a></li>
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-green-600 transition-colors text-sm">Terms of Use</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6">Newsletter</h4>
            <p className="text-xs text-slate-500 mb-4">Get harvest alerts and exclusive recipes.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs uppercase">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/50 py-8 px-8 max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-slate-500 text-sm">© {new Date().getFullYear()} Sari-Store. Freshness Hand-Selected.</span>
          <div className="flex gap-6">
            <Wallet className="w-6 h-6 text-slate-400" />
            <CreditCard className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </footer>
    </>
  )
}
