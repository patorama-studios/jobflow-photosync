
-- Function to create a company team
CREATE OR REPLACE FUNCTION public.create_company_team(
  company_id_param UUID,
  team_name_param TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_team_id UUID;
BEGIN
  INSERT INTO public.company_teams (company_id, name)
  VALUES (company_id_param, team_name_param)
  RETURNING id INTO new_team_id;
  
  RETURN new_team_id;
END;
$$;

-- Function to add a team member
CREATE OR REPLACE FUNCTION public.add_team_member(
  team_id_param UUID,
  user_id_param UUID,
  name_param TEXT,
  email_param TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_member_id UUID;
BEGIN
  INSERT INTO public.team_members (team_id, user_id, name, email)
  VALUES (team_id_param, user_id_param, name_param, email_param)
  RETURNING id INTO new_member_id;
  
  RETURN new_member_id;
END;
$$;
