
import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { CustomersView } from "@/components/customers/CustomersView";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";

function CustomersPage() {
  const { updateSettings } = useHeaderSettings();

  useEffect(() => {
    updateSettings({
      title: "Customers",
      description: "Manage your customers and their information"
    });
  }, [updateSettings]);

  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customers and their information
            </p>
          </div>
          
          <CustomersView />
        </div>
      </PageTransition>
    </MainLayout>
  );
}

export default CustomersPage;
