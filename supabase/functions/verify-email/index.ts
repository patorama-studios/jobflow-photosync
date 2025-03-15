
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  token: string;
  type: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://yuswvcremziknjbxwvsa.supabase.co";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Service role key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const requestBody = await req.json();
    const { email, token, type }: VerifyRequest = requestBody;

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Processing verification for email: ${email}, type: ${type}`);

    let response;
    
    if (type === "signup") {
      // Get the user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
        filters: {
          email: email
        }
      });

      if (userError) {
        console.error("Error listing users:", userError);
        throw userError;
      }
      
      if (!userData.users || userData.users.length === 0) {
        console.error("User not found for email:", email);
        throw new Error("User not found");
      }
      
      const userId = userData.users[0].id;
      console.log(`Found user with ID: ${userId}`);
      
      // Confirm user's email using admin API
      const { data, error } = await supabase.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      );

      if (error) {
        console.error("Error confirming email:", error);
        throw error;
      }
      
      response = { message: "Email verified successfully", success: true };
    } else if (type === "recovery") {
      // Handle password reset
      response = { message: "Password reset flow initiated", success: true };
    } else {
      throw new Error("Invalid verification type");
    }

    console.log("Verification successful:", response);
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
