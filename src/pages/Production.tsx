
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from '@/components/layout/MainLayout';

const Production = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Production Dashboard</h1>
        
        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="board">Production Board</TabsTrigger>
            <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
            <TabsTrigger value="stats">Production Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Production Board</h2>
              <p className="text-muted-foreground">Production board content will be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Production Schedule</h2>
              <p className="text-muted-foreground">Production schedule content will be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Production Stats</h2>
              <p className="text-muted-foreground">Production statistics will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Production;
