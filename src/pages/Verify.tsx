
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  const email = searchParams.get('email');
  const token = searchParams.get('token') || 'token-placeholder'; // Token might not be needed with our approach
  const type = searchParams.get('type') || 'signup';

  useEffect(() => {
    const verify = async () => {
      if (!email) {
        setStatus('error');
        setMessage('Missing email parameter. Unable to verify.');
        return;
      }

      try {
        console.log(`Verifying email: ${email}, token: ${token}, type: ${type}`);
        const { success, error } = await verifyEmail(email, token, type);
        
        if (success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(error || 'Failed to verify email. Please try again.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    verify();
  }, [email, token, type, verifyEmail]);

  const goToLogin = () => {
    // Ensure we navigate to the absolute path, not relative
    navigate('/login', { replace: true });
  };

  const goToSignup = () => {
    // Ensure we navigate to the absolute path, not relative
    navigate('/login', { state: { tab: 'signup' } });
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
            <CardDescription>
              {status === 'loading' ? 'Processing your verification request' : 
               status === 'success' ? 'Your account is now active' : 
               'There was a problem with verification'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center py-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <p className="text-gray-600">{message}</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-gray-600">{message}</p>
                <Button className="mt-4 w-full" onClick={goToLogin}>
                  Sign In Now
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-gray-600">{message}</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button variant="outline" className="w-full" onClick={goToSignup}>
                    Try Again
                  </Button>
                  <Button className="w-full" onClick={goToLogin}>
                    Go to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Verify;
