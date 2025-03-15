
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { VerificationCard } from '@/components/verification/VerificationCard';
import { useVerification } from '@/hooks/useVerification';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const token = searchParams.get('token') || 'token-placeholder'; // Token might not be needed with our approach
  const type = searchParams.get('type') || 'signup';

  const {
    status,
    message,
    verificationAttempted,
    performVerification,
    retryVerification
  } = useVerification({ email, token, type });

  useEffect(() => {
    // Prevent duplicate verification attempts
    if (verificationAttempted.current) return;

    // Add a small delay to ensure the component has mounted properly
    const timeoutId = setTimeout(() => {
      performVerification();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      // Prevent any post-unmount state updates
      verificationAttempted.current = true;
    };
  }, [performVerification, verificationAttempted]);

  const goToLogin = () => {
    // Ensure we navigate to the absolute path, not relative
    navigate('/login', { replace: true });
  };

  const goToSignup = () => {
    // Ensure we navigate to the absolute path, not relative
    navigate('/login', { state: { tab: 'signup' } });
  };

  return (
    <ErrorBoundary>
      <PageTransition>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
          <VerificationCard
            status={status}
            message={message}
            onRetry={retryVerification}
            onGoToLogin={goToLogin}
            onGoToSignup={goToSignup}
          />
        </div>
      </PageTransition>
    </ErrorBoundary>
  );
};

export default Verify;
