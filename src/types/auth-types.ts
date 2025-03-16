
import type { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  activateUser: (email: string) => Promise<{ success: boolean; error: string | null }>;
  sendVerificationEmail: (email: string) => Promise<{ success: boolean; error: string | null }>;
  verifyEmail: (email: string, token: string, type: string) => Promise<{ success: boolean; error: string | null }>;
};
