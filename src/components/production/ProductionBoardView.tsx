
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { KanbanBoard } from "./KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, RefreshCw } from "lucide-react";

export function ProductionBoardView() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Production Board</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your production workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kanban">
          <KanbanBoard />
        </TabsContent>
        
        <TabsContent value="list">
          <div className="bg-white/70 rounded-lg p-6 shadow-sm border border-border/40">
            <div className="text-center text-muted-foreground">
              <p>List view coming soon</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="bg-white/70 rounded-lg p-6 shadow-sm border border-border/40">
            <div className="text-center text-muted-foreground">
              <p>Calendar view coming soon</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="bg-white/70 rounded-lg p-6 shadow-sm border border-border/40">
            <div className="text-center text-muted-foreground">
              <p>Reports coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
