
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadSettingsFormSchema, DownloadSettingsFormValues } from "./schema";
import { ContentLockToggle } from "./ContentLockToggle";
import { CreditLimitFields } from "./CreditLimitFields";
import { PaymentTermsSelector } from "./PaymentTermsSelector";

type ContentDownloadSettingsProps = {
  initialValues?: {
    contentLocked?: boolean;
    enableCreditLimit?: boolean;
    creditLimit?: string;
    paymentTerms?: "onDelivery" | "14days" | "30days";
  };
  onSave: (values: DownloadSettingsFormValues) => void;
  entityType: "client" | "company";
};

export function ContentDownloadSettings({
  initialValues,
  onSave,
  entityType,
}: ContentDownloadSettingsProps) {
  const { toast } = useToast();
  
  const form = useForm<DownloadSettingsFormValues>({
    resolver: zodResolver(downloadSettingsFormSchema),
    defaultValues: {
      contentLocked: initialValues?.contentLocked ?? true,
      enableCreditLimit: initialValues?.enableCreditLimit ?? false,
      creditLimit: initialValues?.creditLimit ?? "1000",
      paymentTerms: initialValues?.paymentTerms ?? "onDelivery",
    },
  });

  function onSubmit(values: DownloadSettingsFormValues) {
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
            <ContentLockToggle form={form} />
            <CreditLimitFields form={form} entityType={entityType} />
            <PaymentTermsSelector form={form} />
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
