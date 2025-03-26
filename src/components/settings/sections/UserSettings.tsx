
import React from "react";
import { TeamMembers } from "./TeamMembers";
import { TestUsersGenerator } from "./TestUsersGenerator";

export function UserSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage team members and permissions
        </p>
      </div>
      
      <TeamMembers />
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold tracking-tight mb-4">Development Tools</h3>
        <TestUsersGenerator />
      </div>
    </div>
  );
}
