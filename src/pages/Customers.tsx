
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { ClientsView } from "@/components/clients/ClientsView";

const Customers = () => {
  return (
    <SidebarLayout>
      <PageTransition>
        <ClientsView />
      </PageTransition>
    </SidebarLayout>
  );
};

export default Customers;
