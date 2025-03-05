
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { ClientsView } from "@/components/clients/ClientsView";

const Clients = () => {
  return (
    <PageTransition>
      <SidebarLayout>
        <ClientsView />
      </SidebarLayout>
    </PageTransition>
  );
};

export default Clients;
