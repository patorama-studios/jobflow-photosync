
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if the avatars bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      throw bucketsError
    }

    // Create the avatars bucket if it doesn't exist
    if (!buckets.find(bucket => bucket.name === 'avatars')) {
      const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 5 // 5MB
      })
      
      if (createBucketError) {
        throw createBucketError
      }
      
      console.log('Created avatars bucket')
    }

    // Create the uploads bucket if it doesn't exist
    if (!buckets.find(bucket => bucket.name === 'uploads')) {
      const { error: createBucketError } = await supabase.storage.createBucket('uploads', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 20 // 20MB
      })
      
      if (createBucketError) {
        throw createBucketError
      }
      
      console.log('Created uploads bucket')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Storage buckets initialized' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error initializing storage buckets:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
