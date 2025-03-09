
import React from "react";
import { TeamMembers } from "./TeamMembers";

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
    </div>
  );
}
