
import { PageTransition } from "@/components/layout/PageTransition";
import { ClientsView } from "@/components/clients/ClientsView";

const Customers = () => {
  return (
    <PageTransition>
      <ClientsView />
    </PageTransition>
  );
};

export default Customers;
