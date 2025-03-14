
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileActionsProps {
  onSave: () => Promise<void>;
  saving: boolean;
}

export function ProfileActions({ onSave, saving }: ProfileActionsProps) {
  return (
    <div className="flex justify-end">
      <Button onClick={onSave} disabled={saving}>
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
