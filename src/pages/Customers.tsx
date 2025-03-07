
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { ClientsView } from "@/components/clients/ClientsView";

const Customers = () => {
  return (
    <MainLayout>
      <PageTransition>
        <ClientsView />
      </PageTransition>
    </MainLayout>
  );
};

export default Customers;
