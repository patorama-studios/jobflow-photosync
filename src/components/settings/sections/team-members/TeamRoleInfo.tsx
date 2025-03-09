
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TeamRoleInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Permissions</CardTitle>
        <CardDescription>
          Control what actions team members can perform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Team Leader</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View and manage all orders</li>
                <li>• Manage team members</li>
                <li>• Access billing information</li>
                <li>• Receive all notifications</li>
              </ul>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Admin Role</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View and manage orders</li>
                <li>• Receive order notifications</li>
                <li>• Cannot access billing</li>
                <li>• Cannot manage team</li>
              </ul>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Finance Role</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View order summaries</li>
                <li>• Access billing information</li>
                <li>• Receive invoice notifications</li>
                <li>• Cannot manage team</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline">
              Customize Permissions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
