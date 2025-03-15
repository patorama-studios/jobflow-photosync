
import { AuthPage } from '@/components/auth/AuthPage';

interface AuthProps {
  defaultTab?: string;
}

const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  return <AuthPage defaultTab={defaultTab} />;
};

export default Auth;
