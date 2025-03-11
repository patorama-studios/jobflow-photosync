
-- Create company_teams table
CREATE TABLE IF NOT EXISTS public.company_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create company_team_members table
CREATE TABLE IF NOT EXISTS public.company_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.company_teams(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_company_teams_company_id ON public.company_teams(company_id);
CREATE INDEX IF NOT EXISTS idx_company_team_members_team_id ON public.company_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_company_team_members_client_id ON public.company_team_members(client_id);

-- Create unique constraint to prevent duplicate team members
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_team_member ON public.company_team_members(team_id, client_id);
