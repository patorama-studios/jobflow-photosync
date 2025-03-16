
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyTeamStateProps {
  onAddMember: () => void;
  isLoading: boolean;
}

export function EmptyTeamState({ onAddMember, isLoading }: EmptyTeamStateProps) {
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground">No team members found.</p>
      <Button 
        className="mt-4" 
        onClick={onAddMember}
        disabled={isLoading}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Team Member
      </Button>
    </div>
  );
}
