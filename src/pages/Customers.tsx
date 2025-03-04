
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { CustomersView } from "@/components/customers/CustomersView";

const Customers = () => {
  return (
    <PageTransition>
      <SidebarLayout>
        <CustomersView />
      </SidebarLayout>
    </PageTransition>
  );
};

export default Customers;
