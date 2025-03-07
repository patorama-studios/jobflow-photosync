
import React from "react";
import { Lock, Unlock } from "lucide-react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { DownloadSettingsFormValues } from "./schema";

interface ContentLockToggleProps {
  form: UseFormReturn<DownloadSettingsFormValues>;
}

export function ContentLockToggle({ form }: ContentLockToggleProps) {
  return (
    <FormField
      control={form.control}
      name="contentLocked"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base flex items-center">
              {field.value ? (
                <Lock className="mr-2 h-4 w-4 text-amber-500" />
              ) : (
                <Unlock className="mr-2 h-4 w-4 text-green-500" />
              )}
              Content Access
            </FormLabel>
            <FormDescription>
              {field.value
                ? "Content is locked until payment is received"
                : "Content is available for download regardless of payment status"}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
