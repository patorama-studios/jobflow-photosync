
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { JobCalendar } from "@/components/dashboard/JobCalendar";
import { useEffect } from "react";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";

const Dashboard = () => {
  const { updateSettings } = useHeaderSettings();

  useEffect(() => {
    updateSettings({
      color: '#ffffff',
      height: 65,
      logoUrl: '',
      showCompanyName: false,
      title: "Dashboard",
      description: "Overview of your business performance"
    });
  }, [updateSettings]);

  return (
    <SidebarLayout>
      <PageTransition>
        <div className="space-y-6 p-6 pb-16">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <div className="flex-1 space-y-6">
              <div className="space-y-6">
                <StatsCards />
                <JobCalendar />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default Dashboard;
