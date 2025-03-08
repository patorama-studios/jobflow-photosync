
import { supabase } from '@/integrations/supabase/client';

export async function generateDummyUsers(count: number = 5) {
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
    'https://i.pravatar.cc/150?img=7',
    'https://i.pravatar.cc/150?img=8',
  ];

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  const roles = ['admin', 'photographer', 'editor', 'manager'];
  
  try {
    // First, create auth users
    const users = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
      const email = `${username}@example.com`;
      const password = 'Password123!'; // Simple password for demo purposes
      const avatar = avatars[Math.floor(Math.random() * avatars.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      
      // This would need to be done via Auth endpoints in a real app
      // Here we'll just create profile entries directly
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
            avatar_url: avatar,
            role
          }
        }
      });
      
      if (userError) {
        console.error('Error creating user:', userError);
        continue; // Skip this user and try the next one
      }
      
      if (userData.user) {
        users.push(userData.user);
      }
    }
    
    return users;
  } catch (error) {
    console.error('Error generating dummy users:', error);
    throw error;
  }
}
