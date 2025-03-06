
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@13.9.0?dts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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

    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request body
    const { action, secretKey, mode } = await req.json()

    // Validate the secret key
    if (!secretKey || typeof secretKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid Stripe secret key' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    })

    // Verify the connection by making a simple API call
    if (action === 'verify') {
      try {
        // Make a simple API call to verify the key works
        const account = await stripe.account.retrieve()
        
        // Save the Stripe connection information to the database
        const { error } = await supabase
          .from('integrations')
          .upsert(
            { 
              id: 'stripe',
              name: 'Stripe',
              connected: true,
              config: { 
                mode: mode,
                account_id: account.id,
                connected_at: new Date().toISOString()
              },
              updated_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          )
        
        if (error) {
          console.error('Error saving Stripe connection:', error)
          // Continue anyway since the verification was successful
        }
        
        return new Response(
          JSON.stringify({ success: true, accountId: account.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Stripe verification error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to verify Stripe credentials' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Handle other actions here (e.g., disconnecting, updating webhooks, etc.)
    
    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error handling Stripe connection:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
