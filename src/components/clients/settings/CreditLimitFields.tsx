
import React from "react";
import { DollarSign } from "lucide-react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DownloadSettingsFormValues } from "./schema";

interface CreditLimitFieldsProps {
  form: UseFormReturn<DownloadSettingsFormValues>;
  entityType: "client" | "company";
}

export function CreditLimitFields({ form, entityType }: CreditLimitFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="enableCreditLimit"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Credit Limit
              </FormLabel>
              <FormDescription>
                Limit the outstanding balance this {entityType} can accumulate
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

      {form.watch("enableCreditLimit") && (
        <FormField
          control={form.control}
          name="creditLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Credit Limit ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="1000"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Content will be automatically locked if unpaid orders exceed this amount
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
