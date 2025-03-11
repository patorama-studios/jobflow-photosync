
-- Enable the plpgsql language if not already enabled
CREATE EXTENSION IF NOT EXISTS plpgsql;

-- Create function to run migrations
CREATE OR REPLACE FUNCTION public.run_migration(migration_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For now, this is just a stub function
  -- In a real implementation, we would check if the migration exists
  -- and execute it, but for our immediate needs we'll manually create
  -- the tables in a previous migration
  RETURN;
END;
$$;

-- Grant execution permission to authenticated users
GRANT EXECUTE ON FUNCTION public.run_migration(text) TO authenticated;
