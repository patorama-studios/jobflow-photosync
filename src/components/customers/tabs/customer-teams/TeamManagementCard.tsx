
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TeamMember } from "@/components/customers/mock-data";
import { SearchBar } from "./SearchBar";
import { TeamMembersList } from "./TeamMembersList";
import { EmptyTeamState } from "./EmptyTeamState";
import { DialogTrigger } from "@/components/ui/dialog";

interface TeamManagementCardProps {
  team: TeamMember[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  removeTeamMember: (memberId: string) => void;
}

export function TeamManagementCard({
  team,
  searchQuery,
  setSearchQuery,
  removeTeamMember,
}: TeamManagementCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Team Management</CardTitle>
        <CardDescription>
          Manage team members who have access to this customer's orders and billing information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
        </div>
        
        {team.length > 0 ? (
          <TeamMembersList 
            team={team} 
            searchQuery={searchQuery}
            removeTeamMember={removeTeamMember}
          />
        ) : (
          <EmptyTeamState onAddMember={() => {}} />
        )}
      </CardContent>
    </Card>
  );
}
