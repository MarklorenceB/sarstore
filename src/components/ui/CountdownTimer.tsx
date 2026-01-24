'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate?: Date
  className?: string
}

export default function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [time, setTime] = useState({ hours: 10, minutes: 56, seconds: 21 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => String(num).padStart(2, '0')

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="text-sm text-gray-600 mr-2">Expires in:</span>
      {[time.hours, time.minutes, time.seconds].map((val, i) => (
        <div key={i} className="flex items-center">
          <span className="bg-primary-500 text-white font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">
            {formatNumber(val)}
          </span>
          {i < 2 && <span className="text-primary-500 font-bold mx-0.5">:</span>}
        </div>
      ))}
    </div>
  )
}
