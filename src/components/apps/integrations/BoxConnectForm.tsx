
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BoxConnectFormProps {
  masterFolderId: string;
  setMasterFolderId: (id: string) => void;
}

export function BoxConnectForm({ masterFolderId, setMasterFolderId }: BoxConnectFormProps) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-primary/10 rounded-md">
        <p className="text-sm">
          Developer token is already set up. Just enter your master folder ID to connect.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="master-folder">Master Folder ID</Label>
        <Input 
          id="master-folder"
          value={masterFolderId}
          onChange={(e) => setMasterFolderId(e.target.value)} 
          placeholder="Enter your Box folder ID"
        />
        <p className="text-xs text-muted-foreground">
          Find your folder ID in the URL when viewing a folder in Box
        </p>
      </div>
    </div>
  );
}
