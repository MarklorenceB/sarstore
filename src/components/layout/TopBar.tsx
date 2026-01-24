'use client'

import { MapPin, Clock, Phone } from 'lucide-react'
import { STORE_INFO } from '@/lib/constants'

export default function TopBar() {
  return (
    <div className="bg-primary-600 text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Deliver to:</span>
            <strong>Manila, Philippines</strong>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Open: {STORE_INFO.hours}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            {STORE_INFO.phone}
          </span>
        </div>
      </div>
    </div>
  )
}
