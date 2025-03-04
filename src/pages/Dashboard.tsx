
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { JobCalendar } from "@/components/dashboard/JobCalendar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { GlassCard } from "@/components/ui/glass-card";
import { ListFilter, Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  return (
    <PageTransition>
      <SidebarLayout>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your jobs, clients, and team in one place
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCards />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <JobCalendar />
          <GlassCard className="col-span-1 h-auto md:h-[450px]">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 py-1">
                  <p className="text-sm font-medium">New job created</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
                <div className="border-l-2 border-primary pl-4 py-1">
                  <p className="text-sm font-medium">Content delivered to client</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="border-l-2 border-primary pl-4 py-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
                <div className="border-l-2 border-primary pl-4 py-1">
                  <p className="text-sm font-medium">New client registered</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="border-l-2 border-primary pl-4 py-1">
                  <p className="text-sm font-medium">Job completed</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border/40 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">Upcoming Jobs</h2>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10" 
                  placeholder="Search jobs..." 
                />
              </div>
              <Button variant="outline" size="icon">
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Job</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Assigned To</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-4 text-sm">Luxury Beachfront Property</td>
                  <td className="px-4 py-4 text-sm">Ocean View Realty</td>
                  <td className="px-4 py-4 text-sm">May 25, 2023</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">John Smith</td>
                  <td className="px-4 py-4 text-sm text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-4 text-sm">Modern Downtown Apartment</td>
                  <td className="px-4 py-4 text-sm">Urban Living Properties</td>
                  <td className="px-4 py-4 text-sm">May 26, 2023</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">Emma Wilson</td>
                  <td className="px-4 py-4 text-sm text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-4 text-sm">Suburban Family Home</td>
                  <td className="px-4 py-4 text-sm">Hometown Realty</td>
                  <td className="px-4 py-4 text-sm">May 27, 2023</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">Michael Brown</td>
                  <td className="px-4 py-4 text-sm text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </SidebarLayout>
    </PageTransition>
  );
};

export default Dashboard;
