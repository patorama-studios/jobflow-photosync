
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TeamRoleInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Information</CardTitle>
        <CardDescription>
          Understanding team member roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Capabilities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Admin</TableCell>
              <TableCell>Full administrative access</TableCell>
              <TableCell>Can manage all settings, users, and organization data</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Photographer</TableCell>
              <TableCell>Photography team member</TableCell>
              <TableCell>Can manage their assignments and upload content</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Editor</TableCell>
              <TableCell>Photo and video editor</TableCell>
              <TableCell>Can access and edit client media</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Finance</TableCell>
              <TableCell>Finance team member</TableCell>
              <TableCell>Can access and manage financial information</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Regular User</TableCell>
              <TableCell>Standard access</TableCell>
              <TableCell>Limited access to system resources</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
