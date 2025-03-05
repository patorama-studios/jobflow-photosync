
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { ClientDetailsView } from "@/components/clients/ClientDetailsView";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  
  return (
    <PageTransition>
      <SidebarLayout>
        <ClientDetailsView clientId={clientId} />
      </SidebarLayout>
    </PageTransition>
  );
};

export default ClientDetails;
