import { NextRequest, NextResponse } from 'next/server'

// Store owner email - this will receive all order notifications
const STORE_OWNER_EMAIL = 'marklorenceberon06@gmail.com'
const STORE_NAME = 'Sari-Store'

interface OrderNotificationData {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes?: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  gcashReference?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: OrderNotificationData = await request.json()

    // Format items list for text email
    const itemsList = data.items
      .map((item) => `• ${item.name} x${item.quantity} = ₱${(item.price * item.quantity).toLocaleString()}`)
      .join('\n')

    const dateTime = new Date().toLocaleString('en-PH', { 
      timeZone: 'Asia/Manila',
      dateStyle: 'full',
      timeStyle: 'short'
    })

    // Create email content
    const emailSubject = `🛒 New Order #${data.orderNumber} - ₱${data.total.toLocaleString()}`
    
    const emailBody = `
═══════════════════════════════════════
🛒 NEW ORDER RECEIVED - ${STORE_NAME}
═══════════════════════════════════════

📋 ORDER DETAILS
───────────────────────────────────────
Order Number: ${data.orderNumber}
Date & Time: ${dateTime}

👤 CUSTOMER INFORMATION
───────────────────────────────────────
Name: ${data.customerName}
Phone: ${data.customerPhone}
Address: ${data.customerAddress}
${data.customerNotes ? `Special Instructions: ${data.customerNotes}` : ''}

🛍️ ORDER ITEMS
───────────────────────────────────────
${itemsList}

💰 PAYMENT SUMMARY
───────────────────────────────────────
Subtotal: ₱${data.subtotal.toLocaleString()}
Delivery Fee: ${data.deliveryFee === 0 ? 'FREE' : `₱${data.deliveryFee.toLocaleString()}`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ₱${data.total.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: ${data.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 GCash'}
${data.gcashReference ? `GCash Reference: ${data.gcashReference}` : ''}

═══════════════════════════════════════
📦 Please prepare this order for delivery!
═══════════════════════════════════════
    `.trim()

    // HTML version of email (nicer formatting)
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - ${STORE_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🛒 New Order!</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${data.orderNumber}</p>
              <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">${dateTime}</p>
            </td>
          </tr>
          
          <!-- Total Badge -->
          <tr>
            <td style="padding: 20px 40px 0 40px; text-align: center;">
              <div style="display: inline-block; background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 12px 24px;">
                <span style="color: #92400e; font-size: 14px; font-weight: 600;">ORDER TOTAL</span>
                <br>
                <span style="color: #92400e; font-size: 28px; font-weight: bold;">₱${data.total.toLocaleString()}</span>
              </div>
            </td>
          </tr>
          
          <!-- Customer Info -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 15px 0; color: #166534; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">👤 Customer Information</h2>
                    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Name:</strong> ${data.customerName}</p>
                    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Phone:</strong> <a href="tel:${data.customerPhone}" style="color: #16a34a; text-decoration: none;">${data.customerPhone}</a></p>
                    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Address:</strong> ${data.customerAddress}</p>
                    ${data.customerNotes ? `<p style="margin: 15px 0 0 0; padding: 10px; background-color: #ffffff; border-radius: 8px; color: #6b7280;"><strong>📝 Notes:</strong> ${data.customerNotes}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">🛍️ Order Items</h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                ${data.items.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                  <td style="padding: 15px 20px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #374151; font-weight: 500;">${item.name}</span>
                    <br>
                    <span style="color: #6b7280; font-size: 14px;">₱${item.price.toLocaleString()} × ${item.quantity}</span>
                  </td>
                  <td style="padding: 15px 20px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <span style="color: #16a34a; font-weight: bold;">₱${(item.price * item.quantity).toLocaleString()}</span>
                  </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          
          <!-- Payment Summary -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 12px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="color: #6b7280; padding: 5px 0;">Subtotal</td>
                        <td style="color: #374151; text-align: right; padding: 5px 0;">₱${data.subtotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 5px 0;">Delivery Fee</td>
                        <td style="color: ${data.deliveryFee === 0 ? '#16a34a' : '#374151'}; text-align: right; padding: 5px 0; font-weight: ${data.deliveryFee === 0 ? 'bold' : 'normal'};">${data.deliveryFee === 0 ? 'FREE' : `₱${data.deliveryFee.toLocaleString()}`}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 5px 0;">Payment Method</td>
                        <td style="color: #374151; text-align: right; padding: 5px 0;">${data.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 GCash'}</td>
                      </tr>
                      ${data.gcashReference ? `
                      <tr>
                        <td style="color: #6b7280; padding: 5px 0;">GCash Reference</td>
                        <td style="color: #374151; text-align: right; padding: 5px 0; font-family: monospace;">${data.gcashReference}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td colspan="2" style="padding: 15px 0 0 0;">
                          <div style="border-top: 2px solid #e5e7eb; padding-top: 15px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #111827; font-size: 18px; font-weight: bold;">TOTAL</td>
                                <td style="color: #16a34a; font-size: 24px; font-weight: bold; text-align: right;">₱${data.total.toLocaleString()}</td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">📦 Please prepare this order for delivery!</p>
              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">${STORE_NAME} - Your neighborhood grocery</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    // Try different email services in order of preference
    let emailSent = false
    let emailResult: any = null

    // 1. Try Resend (preferred - free tier: 100 emails/day)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey && !emailSent) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${STORE_NAME} <onboarding@resend.dev>`,
            to: [STORE_OWNER_EMAIL],
            subject: emailSubject,
            text: emailBody,
            html: emailHtml,
          }),
        })

        if (response.ok) {
          emailResult = await response.json()
          emailSent = true
          console.log('✅ Email sent via Resend:', emailResult.id)
        } else {
          const error = await response.text()
          console.error('Resend error:', error)
        }
      } catch (e) {
        console.error('Resend failed:', e)
      }
    }

    // 2. Try Supabase Edge Function (if configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey && !emailSent) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: STORE_OWNER_EMAIL,
            subject: emailSubject,
            text: emailBody,
            html: emailHtml,
          }),
        })

        if (response.ok) {
          emailResult = await response.json()
          emailSent = true
          console.log('✅ Email sent via Supabase Edge Function')
        }
      } catch (e) {
        // Edge function might not exist
        console.log('Supabase Edge Function not available')
      }
    }

    // 3. Always log to console for debugging
    console.log('\n' + '═'.repeat(60))
    console.log('📧 ORDER NOTIFICATION')
    console.log('═'.repeat(60))
    console.log(`📬 To: ${STORE_OWNER_EMAIL}`)
    console.log(`📋 Subject: ${emailSubject}`)
    console.log('─'.repeat(60))
    console.log(emailBody)
    console.log('═'.repeat(60) + '\n')

    // Return response
    if (emailSent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Order notification email sent successfully',
        emailId: emailResult?.id,
      })
    } else {
      // Email not sent but order still processed
      return NextResponse.json({ 
        success: true, 
        message: 'Order notification logged. Configure RESEND_API_KEY to enable email delivery.',
        warning: 'Email service not configured',
      })
    }

  } catch (error: any) {
    console.error('❌ Error sending notification:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
