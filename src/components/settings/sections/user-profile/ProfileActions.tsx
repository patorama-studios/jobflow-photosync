
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileActionsProps {
  saving: boolean;
  saveProfile: () => Promise<void>;
}

export function ProfileActions({ saving, saveProfile }: ProfileActionsProps) {
  return (
    <div className="pt-4">
      <Button 
        onClick={saveProfile} 
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}
