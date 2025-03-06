
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@13.9.0?dts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request body
    const { paymentId, amount, reason, orderId, isFullRefund } = await req.json()

    // Validate inputs
    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'Payment ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Valid refund amount is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing refund for payment ${paymentId}, amount: ${amount}`)

    // Process the refund using Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: amount, // Amount in cents
      reason: 'requested_by_customer',
      metadata: {
        reason: reason || 'Customer requested refund',
        orderId: orderId.toString(),
        isFullRefund: isFullRefund.toString(),
      },
    })

    console.log('Refund processed successfully:', refund.id)

    // Create a record of the refund in the database
    const { data: refundRecord, error: dbError } = await supabase
      .from('refunds')
      .insert([
        {
          order_id: orderId,
          amount: amount / 100, // Convert cents back to dollars for storage
          date: new Date().toISOString(),
          reason: reason || 'Customer requested refund',
          status: 'completed', 
          stripe_refund_id: refund.id,
          is_full_refund: isFullRefund,
        },
      ])
      .select()

    if (dbError) {
      console.error('Error saving refund to database:', dbError)
      // Continue anyway since the refund was processed
    }

    // Update order payment status
    if (isFullRefund) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'fully_refunded' })
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order status:', updateError)
      }
    } else {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'partially_refunded' })
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        refundId: refundRecord?.[0]?.id || 'unknown',
        stripeRefundId: refund.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing refund:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
