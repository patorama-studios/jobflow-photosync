import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen, Video, File, Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";

// Sample learning resources
const resources = [
  {
    id: 1,
    title: "Real Estate Photography Basics",
    description: "Learn the fundamentals of capturing stunning real estate photos",
    type: "article",
    icon: <BookOpen className="h-6 w-6" />,
    category: "photography"
  },
  {
    id: 2,
    title: "Advanced Composition Techniques",
    description: "Take your real estate photos to the next level with these composition tips",
    type: "video",
    icon: <Video className="h-6 w-6" />,
    category: "photography"
  },
  {
    id: 3,
    title: "Lighting Guide for Interiors",
    description: "Master interior lighting to showcase properties at their best",
    type: "article",
    icon: <BookOpen className="h-6 w-6" />,
    category: "photography"
  },
  {
    id: 4,
    title: "Post-Processing Workflow",
    description: "Efficient editing workflow for real estate photography",
    type: "video",
    icon: <Video className="h-6 w-6" />,
    category: "editing"
  },
  {
    id: 5,
    title: "Client Communication Templates",
    description: "Templates for professional client communication",
    type: "document",
    icon: <File className="h-6 w-6" />,
    category: "business"
  },
  {
    id: 6,
    title: "Equipment Recommendations",
    description: "Recommended gear for real estate photographers at all levels",
    type: "article",
    icon: <BookOpen className="h-6 w-6" />,
    category: "photography"
  },
  {
    id: 7,
    title: "Video Tour Best Practices",
    description: "Create engaging property video tours that sell",
    type: "video",
    icon: <Video className="h-6 w-6" />,
    category: "videography"
  },
  {
    id: 8,
    title: "Pricing Strategy Guide",
    description: "How to price your real estate photography services",
    type: "document",
    icon: <File className="h-6 w-6" />,
    category: "business"
  }
];

// Resource Card Component
function ResourceCard({ resource }: { resource: typeof resources[0] }) {
  const typeColors: Record<string, string> = {
    article: "bg-blue-100 text-blue-800",
    video: "bg-red-100 text-red-800",
    document: "bg-green-100 text-green-800"
  };

  return (
    <GlassCard className="overflow-hidden h-full" hoverEffect>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            {resource.icon}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[resource.type]}`}>
            {resource.type}
          </span>
        </div>
        <h3 className="text-lg font-medium mb-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {resource.description}
        </p>
        <a
          href="#"
          className="inline-flex items-center text-primary hover:underline text-sm font-medium"
        >
          View Resource
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </GlassCard>
  );
}

const Learning = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 max-w-3xl">
                <h1 className="text-3xl font-semibold">Learning Hub</h1>
                <p className="text-muted-foreground mt-2">
                  Access training materials, tutorials, and guides to help you master real estate photography and content creation.
                </p>
              </div>
              
              <Tabs defaultValue="all" className="max-w-5xl mx-auto">
                <TabsList className="mb-8">
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="photography">Photography</TabsTrigger>
                  <TabsTrigger value="videography">Videography</TabsTrigger>
                  <TabsTrigger value="editing">Editing</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </TabsContent>
                
                {["photography", "videography", "editing", "business"].map((category) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources
                        .filter((resource) => resource.category === category)
                        .map((resource) => (
                          <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="mt-16 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-4">Can't find what you're looking for?</h2>
                <p className="text-muted-foreground mb-6">
                  Our learning resources are constantly growing. If you need help with something specific, let us know!
                </p>
                <div className="flex justify-center">
                  <a href="#" className="inline-flex items-center text-primary hover:underline">
                    <Link2 className="h-4 w-4 mr-2" />
                    Request a tutorial
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Learning;
