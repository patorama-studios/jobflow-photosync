
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON in request body" }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    const { action, user_id } = requestData;
    
    console.log(`Running migration action: ${action}`);
    
    if (action === 'delete_user' && user_id) {
      console.log(`Attempting to delete user with ID: ${user_id}`);
      
      try {
        // Execute the delete_user function 
        const { data, error } = await supabaseAdmin.rpc('delete_user', { 
          user_id 
        });
        
        if (error) {
          console.error('Error executing delete_user function:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }), 
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
              status: 500 
            }
          );
        }
        
        console.log('User deletion successful:', data);
        return new Response(
          JSON.stringify({ success: true, result: data }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (execError) {
        console.error('Error executing RPC:', execError);
        return new Response(
          JSON.stringify({ success: false, error: execError.message || 'Failed to execute delete_user function' }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action specified' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    );
    
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
