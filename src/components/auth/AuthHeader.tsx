
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const AuthHeader: React.FC = () => {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
      <CardDescription>Sign in or create an account to continue</CardDescription>
    </CardHeader>
  );
};
