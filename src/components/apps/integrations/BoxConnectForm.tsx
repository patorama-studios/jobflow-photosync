
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createBoxIntegration } from "@/lib/box-integration";
import { Folder } from "lucide-react";

interface BoxConnectFormProps {
  masterFolderId: string;
  setMasterFolderId: (id: string) => void;
}

export function BoxConnectForm({ masterFolderId, setMasterFolderId }: BoxConnectFormProps) {
  const [loading, setLoading] = useState(false);
  const [folderList, setFolderList] = useState<{id: string, name: string}[]>([]);
  const [showFolderList, setShowFolderList] = useState(false);

  const handleBrowseFolders = async () => {
    setLoading(true);
    try {
      // Initialize Box integration
      const boxIntegration = createBoxIntegration();
      
      // Get root folders (simplified for demo)
      // In a real implementation, this would use Box API to list folders
      const demoFolders = [
        { id: '123456789', name: 'Root Folder' },
        { id: '987654321', name: 'Client Projects' },
        { id: '456789123', name: 'Real Estate Photos' },
      ];
      
      setFolderList(demoFolders);
      setShowFolderList(true);
    } catch (error) {
      console.error('Failed to browse folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectFolder = (id: string, name: string) => {
    setMasterFolderId(id);
    setShowFolderList(false);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-primary/10 rounded-md">
        <p className="text-sm">
          Developer token is already set up. Connect to your Box account by entering or selecting your master folder ID.
        </p>
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
  );
}
