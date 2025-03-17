
-- This function allows a secure way to delete users with proper permissions
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with the privileges of the function creator
AS $$
DECLARE
  current_user_id UUID;
  current_user_role TEXT;
BEGIN
  -- Get the current user's ID from the auth.uid() function
  current_user_id := auth.uid();
  
  -- Verify the current user is an admin
  SELECT role INTO current_user_role FROM public.profiles WHERE id = current_user_id;
  
  IF current_user_role IS NULL OR current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
  
  -- Do not allow admins to delete themselves
  IF user_id = current_user_id THEN
    RAISE EXCEPTION 'Administrators cannot delete their own accounts';
  END IF;
  
  -- Delete from auth.users (if exists) - This requires superuser privileges
  -- which is why we use SECURITY DEFINER
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in delete_user function: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user(UUID) TO authenticated;
