
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { CompanyDetailsView } from "@/components/clients/CompanyDetailsView";
import { useParams } from "react-router-dom";

const CompanyDetails = () => {
  const { companyId } = useParams<{ companyId: string }>();
  
  return (
    <PageTransition>
      <SidebarLayout>
        <CompanyDetailsView companyId={companyId} />
      </SidebarLayout>
    </PageTransition>
  );
};

export default CompanyDetails;
