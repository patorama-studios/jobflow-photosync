
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, LogIn } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';
import { useAuth } from '@/contexts/MySQLAuthContext';
import { useNavigate } from 'react-router-dom';

export const EditorHeader: React.FC<{ isAuthenticated?: boolean | null }> = ({ isAuthenticated }) => {
  const { refreshTemplates, loading } = useNotificationTemplates();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notification Editor</h2>
        <p className="text-muted-foreground">
          Customize notification templates for emails, SMS, and push notifications
        </p>
        {isAuthenticated === false && !user && (
          <div className="flex items-center mt-2 space-x-2">
            <p className="text-sm text-amber-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Please log in to edit notifications
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/login', { state: { from: '/settings/editor' } })}
            >
              <LogIn className="mr-1 h-3.5 w-3.5" />
              Log In
            </Button>
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshTemplates}
        disabled={isAuthenticated === false || loading}
      >
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </>
        )}
      </Button>
    </div>
  );
};
