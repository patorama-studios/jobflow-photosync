
import React from "react";
import { Calendar } from "lucide-react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DownloadSettingsFormValues } from "./schema";

interface PaymentTermsSelectorProps {
  form: UseFormReturn<DownloadSettingsFormValues>;
}

export function PaymentTermsSelector({ form }: PaymentTermsSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="paymentTerms"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Payment Terms
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="onDelivery">Pay on Delivery</SelectItem>
              <SelectItem value="14days">14-Day Terms</SelectItem>
              <SelectItem value="30days">30-Day Terms</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            When payment is due after content delivery
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
