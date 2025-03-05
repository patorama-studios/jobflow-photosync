
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Lock, Unlock, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  contentLocked: z.boolean().default(true),
  enableCreditLimit: z.boolean().default(false),
  creditLimit: z.string().optional(),
  paymentTerms: z.enum(["onDelivery", "14days", "30days"]).default("onDelivery"),
});

type ContentDownloadSettingsProps = {
  initialValues?: {
    contentLocked?: boolean;
    enableCreditLimit?: boolean;
    creditLimit?: string;
    paymentTerms?: "onDelivery" | "14days" | "30days";
  };
  onSave: (values: z.infer<typeof formSchema>) => void;
  entityType: "client" | "company";
};

export function ContentDownloadSettings({
  initialValues,
  onSave,
  entityType,
}: ContentDownloadSettingsProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentLocked: initialValues?.contentLocked ?? true,
      enableCreditLimit: initialValues?.enableCreditLimit ?? false,
      creditLimit: initialValues?.creditLimit ?? "1000",
      paymentTerms: initialValues?.paymentTerms ?? "onDelivery",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    toast({
      title: "Settings updated",
      description: `Content download settings for this ${entityType} have been updated.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Download Settings</CardTitle>
        <CardDescription>
          Configure how content access is managed for this {entityType}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
