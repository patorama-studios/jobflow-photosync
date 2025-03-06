
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createBoxIntegration } from "@/lib/box-integration";
import { Folder, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BoxAuthLink } from './BoxAuthLink';

interface BoxConnectFormProps {
  masterFolderId: string;
  setMasterFolderId: (id: string) => void;
}

export function BoxConnectForm({ masterFolderId, setMasterFolderId }: BoxConnectFormProps) {
  const [loading, setLoading] = useState(false);
  const [folderList, setFolderList] = useState<{id: string, name: string}[]>([]);
  const [showFolderList, setShowFolderList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if token is in localStorage or in the URL (for OAuth redirect)
  useEffect(() => {
    const checkAuth = async () => {
      const boxToken = localStorage.getItem('box_access_token');
      
      // Check for auth code in URL (would happen after OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      const boxAuthState = urlParams.get('state');
      
      if (authCode && boxAuthState) {
        // Would exchange code for token in a real implementation
        // This is a simulated exchange
        localStorage.setItem('box_access_token', 'simulated_token_from_auth_code');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsAuthenticated(true);
      } else if (boxToken) {
        // We have a token already
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);

  const handleBrowseFolders = async () => {
    if (!isAuthenticated) {
      setAuthError("You need to authenticate with Box first");
      return;
    }
    
    setLoading(true);
    setAuthError(null);
    
    try {
      // In a real implementation, we would use the Box API client with the authenticated token
      // Since we're just simulating, we'll use demo data
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoFolders = [
        { id: '123456789', name: 'Root Folder' },
        { id: '987654321', name: 'Client Projects' },
        { id: '456789123', name: 'Real Estate Photos' },
      ];
      
      setFolderList(demoFolders);
      setShowFolderList(true);
    } catch (error) {
      console.error('Failed to browse folders:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve folders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectFolder = (id: string, name: string) => {
    setMasterFolderId(id);
    setShowFolderList(false);
    toast({
      title: "Folder selected",
      description: `Selected folder: ${name}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('box_access_token');
    setIsAuthenticated(false);
    setShowFolderList(false);
    setFolderList([]);
  };

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <div>
          <div className="p-3 bg-primary/10 rounded-md mb-4">
            <p className="text-sm">
              Connect to your Box account to access your folders and files. This integration requires authentication.
            </p>
          </div>
          
          <BoxAuthLink setIsAuthenticated={setIsAuthenticated} />
          
          {authError && (
            <div className="mt-2 flex items-center text-sm text-red-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              {authError}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
            <Lock className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Authenticated with Box
              </p>
              <p className="text-xs text-green-600">
                Your account is connected and ready to use
              </p>
            </div>
            <Button 
              variant="link" 
              className="ml-auto text-sm" 
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="master-folder">Master Folder ID</Label>
            <div className="flex gap-2">
              <Input 
                id="master-folder"
                value={masterFolderId}
                onChange={(e) => setMasterFolderId(e.target.value)} 
                placeholder="Enter your Box folder ID"
              />
              <Button 
                variant="outline" 
                onClick={handleBrowseFolders}
                disabled={loading}
              >
                <Folder className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Find your folder ID in the URL when viewing a folder in Box
            </p>
          </div>

          {showFolderList && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="bg-muted p-2 font-medium text-sm">Available Folders</div>
              <div className="divide-y">
                {folderList.map(folder => (
                  <div 
                    key={folder.id} 
                    className="p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center"
                    onClick={() => selectFolder(folder.id, folder.name)}
                  >
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">ID: {folder.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
