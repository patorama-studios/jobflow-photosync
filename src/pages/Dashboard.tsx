import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { JobCalendar } from "@/components/dashboard/JobCalendar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { GlassCard } from "@/components/ui/glass-card";
import { ListFilter, Bell, Plus, Search, Kanban, Clock, CalendarIcon } from "lucide-react";
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
              Welcome back! Here's what's happening today
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="col-span-1 lg:col-span-2 h-auto md:h-[450px]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Today's Jobs</h3>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Modern Downtown Apartment</h4>
                      <p className="text-sm text-muted-foreground">Urban Living Properties</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        9:00 AM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Luxury Beachfront Property</h4>
                      <p className="text-sm text-muted-foreground">Ocean View Realty</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        1:30 PM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Suburban Family Home</h4>
                      <p className="text-sm text-muted-foreground">Hometown Realty</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        4:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="col-span-1 h-auto md:h-[450px]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">In Production</h3>
                <Button variant="ghost" size="sm">
                  <Kanban className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-amber-500 pl-4 py-1">
                  <p className="text-sm font-medium">Photo Editing</p>
                  <p className="text-xs text-muted-foreground">2 jobs in progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="border-l-2 border-green-500 pl-4 py-1">
                  <p className="text-sm font-medium">3D Rendering</p>
                  <p className="text-xs text-muted-foreground">1 job in progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm font-medium">Video Production</p>
                  <p className="text-xs text-muted-foreground">3 jobs in progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="col-span-1 md:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold mt-1">$24,890</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span>↑ 12%</span>
                    <span className="text-muted-foreground ml-1">vs last month</span>
                  </p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold mt-1">$5,240</p>
                  <p className="text-xs text-amber-500 flex items-center mt-1">
                    <span>4 invoices</span>
                    <span className="text-muted-foreground ml-1">pending</span>
                  </p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold mt-1">32%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span>↑ 3%</span>
                    <span className="text-muted-foreground ml-1">vs last month</span>
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="col-span-1">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Harbor View Estate</p>
                      <p className="text-xs text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">City Loft Apartments</p>
                      <p className="text-xs text-muted-foreground">Due tomorrow</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Mountain Retreat</p>
                      <p className="text-xs text-muted-foreground">Due in 5 days</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border/40 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Jobs</h2>
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
