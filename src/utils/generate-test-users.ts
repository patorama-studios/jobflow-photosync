
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function generateTestUsers() {
  const testUsers = [
    {
      email: 'admin@example.com',
      password: 'Password123!',
      fullName: 'Admin User',
      role: 'admin'
    },
    {
      email: 'photographer@example.com',
      password: 'Password123!',
      fullName: 'Photographer User',
      role: 'photographer'
    },
    {
      email: 'editor@example.com',
      password: 'Password123!',
      fullName: 'Editor User',
      role: 'editor'
    },
    {
      email: 'finance@example.com',
      password: 'Password123!',
      fullName: 'Finance User',
      role: 'finance'
    },
    {
      email: 'user@example.com',
      password: 'Password123!',
      fullName: 'Regular User',
      role: 'user'
    }
  ];

  const results = [];
  let successCount = 0;
  const failureMessages = [];

  for (const user of testUsers) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('username', user.email.split('@')[0]);
      
      if (existingUsers?.length > 0) {
        failureMessages.push(`User ${user.email} already exists`);
        continue;
      }

      // Create user in Auth
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName,
            role: user.role
          }
        }
      });
      
      if (signUpError) {
        console.error('Error creating user:', user.email, signUpError);
        failureMessages.push(`Failed to create ${user.role} user: ${signUpError.message}`);
        continue;
      }
      
      console.log(`Created ${user.role} user:`, userData?.user?.id);
      successCount++;
      results.push(userData?.user);
    } catch (error: any) {
      console.error('Error in user creation:', error);
      failureMessages.push(`Error creating ${user.role} user: ${error.message}`);
    }
  }

  if (successCount > 0) {
    toast.success(`Successfully created ${successCount} test users`, {
      description: 'You can use these accounts to test different role permissions'
    });
  }

  if (failureMessages.length > 0) {
    toast.error(`Failed to create ${failureMessages.length} users`, {
      description: failureMessages.slice(0, 3).join('; ') + 
        (failureMessages.length > 3 ? ` and ${failureMessages.length - 3} more...` : '')
    });
  }

  return { success: successCount, failures: failureMessages.length, results };
}
