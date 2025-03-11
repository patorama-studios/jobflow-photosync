
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { name } = await req.json()
    
    if (!name) {
      return new Response(
        JSON.stringify({ error: 'Migration name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // For company_teams migration, create the tables if they don't exist
    if (name === 'company_teams') {
      // Create company_teams table
      const { error: teamsError } = await supabaseClient.rpc('create_company_teams_table');
      
      if (teamsError) {
        console.error('Error creating company_teams table:', teamsError);
        return new Response(
          JSON.stringify({ error: teamsError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // Create company_team_members table
      const { error: membersError } = await supabaseClient.rpc('create_company_team_members_table');
      
      if (membersError) {
        console.error('Error creating company_team_members table:', membersError);
        return new Response(
          JSON.stringify({ error: membersError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Company teams tables created successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Execute the migration function
    const { data, error } = await supabaseClient.rpc('run_migration', { migration_name: name })
    
    if (error) {
      console.error('Error running migration:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Server error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
