'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Package, Truck, Home, Copy, Phone, MapPin, CreditCard, Clock, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui'
import { STORE_INFO, DELIVERY_CONFIG } from '@/lib/constants'
import { formatPrice, copyToClipboard, storage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface OrderItem {
  name: string
  price: number
  quantity: number
  emoji?: string
}

interface OrderDetails {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes?: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: 'cod' | 'gcash'
  gcashReference?: string
  createdAt: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderNumber = params.id as string
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Try to get order details from localStorage
    const savedOrder = storage.get(`order_${orderNumber}`, null)
    if (savedOrder) {
      setOrderDetails(savedOrder)
    }
  }, [orderNumber])

  const handleCopyOrderNumber = async () => {
    const success = await copyToClipboard(orderNumber)
    if (success) {
      toast.success('Order number copied!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🛒</span>
            <span className="font-bold text-xl text-primary-600">{STORE_INFO.name}</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received it and will process it shortly.
          </p>
        </motion.div>

        {/* Order Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between p-3 sm:p-4 bg-primary-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-lg sm:text-xl font-bold text-primary-600">{orderNumber}</p>
            </div>
            <button
              onClick={handleCopyOrderNumber}
              className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>

          {/* Order Timeline */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Order Confirmed</p>
                <p className="text-xs sm:text-sm text-gray-500">Your order has been received</p>
              </div>
              <Clock className="w-4 h-4 text-primary-500" />
            </div>

            <div className="ml-4 sm:ml-5 border-l-2 border-dashed border-gray-200 h-6 sm:h-8" />

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-400 text-sm sm:text-base">Preparing</p>
                <p className="text-xs sm:text-sm text-gray-400">We're packing your items</p>
              </div>
            </div>

            <div className="ml-4 sm:ml-5 border-l-2 border-dashed border-gray-200 h-6 sm:h-8" />

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-400 text-sm sm:text-base">Out for Delivery</p>
                <p className="text-xs sm:text-sm text-gray-400">Est: {DELIVERY_CONFIG.estimatedTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-lg mb-6"
          >
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
              Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    {item.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(orderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className={orderDetails.deliveryFee === 0 ? 'text-primary-600 font-medium' : ''}>
                  {orderDetails.deliveryFee === 0 ? 'FREE' : formatPrice(orderDetails.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(orderDetails.total)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Customer & Payment Info */}
        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid sm:grid-cols-2 gap-4 mb-6"
          >
            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary-500" />
                Delivery Info
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-900 font-medium">{orderDetails.customerName}</p>
                <p className="text-gray-600">{orderDetails.customerPhone}</p>
                <p className="text-gray-600">{orderDetails.customerAddress}</p>
                {orderDetails.customerNotes && (
                  <p className="text-gray-500 text-xs italic">Note: {orderDetails.customerNotes}</p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-primary-500" />
                Payment Info
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-900 font-medium">
                  {orderDetails.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 GCash'}
                </p>
                {orderDetails.gcashReference && (
                  <p className="text-gray-600">Ref: {orderDetails.gcashReference}</p>
                )}
                <p className="text-primary-600 font-bold text-lg">
                  {formatPrice(orderDetails.total)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8"
        >
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Need Help?</h3>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm">
            If you have any questions about your order, please contact us:
          </p>
          <a
            href={`tel:${STORE_INFO.phone.replace(/-/g, '')}`}
            className="inline-flex items-center gap-2 px-4 py-2 sm:py-3 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors text-sm sm:text-base"
          >
            <Phone className="w-4 h-4" />
            {STORE_INFO.phone}
          </a>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <Link href="/" className="flex-1">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
