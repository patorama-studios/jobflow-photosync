
import React from 'react';
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  icon: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon
}) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-muted-foreground">
        {icon}
      </div>
      <Input 
        id={id} 
        name={name}
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`pl-10 ${error && touched ? 'border-destructive' : ''}`}
        aria-invalid={!!error && touched}
      />
      {error && touched && (
        <div className="flex items-center mt-1 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};
