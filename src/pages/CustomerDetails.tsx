
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { CustomerDetailsView } from "@/components/customers/CustomerDetailsView";
import { useParams } from "react-router-dom";

const CustomerDetails = () => {
  const { customerId } = useParams<{ customerId: string }>();
  
  return (
    <PageTransition>
      <SidebarLayout>
        <CustomerDetailsView customerId={customerId} />
      </SidebarLayout>
    </PageTransition>
  );
};

export default CustomerDetails;
