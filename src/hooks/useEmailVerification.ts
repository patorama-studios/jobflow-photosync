
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useEmailVerification = () => {
  const { toast } = useToast();

  const sendVerificationEmail = async (email: string) => {
    try {
      // Use window.location.origin to ensure we use the current domain
      // This fixes the localhost redirect issue
      const currentOrigin = window.location.origin;
      const verificationLink = `${currentOrigin}/verify?email=${encodeURIComponent(email)}&type=signup`;
      
      console.log('Creating verification link with origin:', currentOrigin);
      
      const emailHtml = `
        <h1>Verify Your Email Address</h1>
        <p>Thank you for signing up with Patorama Studios!</p>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email</a>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
        <p>If you didn't sign up for Patorama Studios, you can safely ignore this email.</p>
      `;
      
      // Create an AbortController to handle timeouts
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 15000); // 15 second timeout
      
      try {
        const response = await supabase.functions.invoke('send-email', {
          body: {
            to: email,
            subject: 'Verify Your Email - Patorama Studios',
            html: emailHtml,
          }
          // Remove the signal property as it's not supported in FunctionInvokeOptions
        });

        clearTimeout(timeoutId);

        if (response.error) {
          throw new Error(response.error.message || 'Failed to send verification email');
        }

        toast({
          title: "Verification email sent",
          description: "Please check your inbox for the verification link",
        });

        return { success: true, error: null };
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Failed to send verification email",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      return { success: false, error: error.message || 'Unknown error' };
    }
  };

  const verifyEmail = async (email: string, token: string, type: string) => {
    if (!email) {
      console.error('Missing email for verification');
      return { success: false, error: 'Email is required for verification' };
    }
    
    try {
      console.log(`Verifying email for: ${email}, type: ${type}`);
      
      // Create an AbortController to handle timeouts
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 15000); // 15 second timeout
      
      try {
        const response = await supabase.functions.invoke('verify-email', {
          body: { email, token, type }
          // Remove the signal property as it's not supported in FunctionInvokeOptions
        });

        clearTimeout(timeoutId);

        if (response.error) {
          console.error('Supabase function error:', response.error);
          throw new Error(response.error.message || 'Failed to verify email');
        }

        toast({
          title: "Email verified successfully",
          description: "You can now sign in to your account",
        });

        return { success: true, error: null };
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Verification request timed out. Please try again.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast({
        title: "Failed to verify email",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      return { success: false, error: error.message || 'Unknown error' };
    }
  };

  return {
    sendVerificationEmail,
    verifyEmail,
  };
};
