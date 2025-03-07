
import { PageTransition } from "@/components/layout/PageTransition";
import { MainLayout } from "@/components/layout/MainLayout";
import { ClientDetailsView } from "@/components/clients/ClientDetailsView";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  
  return (
    <MainLayout>
      <PageTransition>
        <ClientDetailsView clientId={clientId} />
      </PageTransition>
    </MainLayout>
  );
};

export default ClientDetails;
