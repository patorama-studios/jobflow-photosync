
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TeamPermissionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Permissions</CardTitle>
        <CardDescription>
          Understanding team member roles and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Capabilities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Team Leader</TableCell>
              <TableCell>Primary account owner</TableCell>
              <TableCell>Full access to all client information and billing data</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Admin</TableCell>
              <TableCell>Team administrator</TableCell>
              <TableCell>Can view/edit orders and client information</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Finance</TableCell>
              <TableCell>Financial access only</TableCell>
              <TableCell>Can view billing information and invoices only</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
