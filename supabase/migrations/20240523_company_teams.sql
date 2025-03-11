
-- 1. Create company_teams table if it doesn't exist
CREATE OR REPLACE FUNCTION create_company_teams_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS company_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Add RLS policies for company_teams
  ALTER TABLE company_teams ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Allow full access to authenticated users" ON company_teams;
  CREATE POLICY "Allow full access to authenticated users"
    ON company_teams
    USING (auth.role() = 'authenticated');
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating company_teams table: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- 2. Create company_team_members table if it doesn't exist
CREATE OR REPLACE FUNCTION create_company_team_members_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS company_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES company_teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'member',
    is_photographer BOOLEAN DEFAULT FALSE,
    payout_rate NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Add RLS policies for company_team_members
  ALTER TABLE company_team_members ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Allow full access to authenticated users" ON company_team_members;
  CREATE POLICY "Allow full access to authenticated users"
    ON company_team_members
    USING (auth.role() = 'authenticated');
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating company_team_members table: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- 3. Register the migration
INSERT INTO migrations (name, applied_at)
VALUES ('20240523_company_teams', NOW())
ON CONFLICT (name) DO NOTHING;
