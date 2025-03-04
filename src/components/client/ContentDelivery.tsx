
import { useState } from "react";
import { Download, Lock, Eye, Image, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Example content data
const contentItems = [
  {
    id: 1,
    type: "image",
    title: "Front Exterior - Day",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    locked: false
  },
  {
    id: 2,
    type: "image",
    title: "Kitchen - Wide Angle",
    thumbnail: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    locked: false
  },
  {
    id: 3,
    type: "image",
    title: "Master Bedroom",
    thumbnail: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    locked: false
  },
  {
    id: 4,
    type: "video",
    title: "Property Walkthrough",
    thumbnail: "https://images.unsplash.com/photo-1560185008-a33f5c7cc8cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    locked: true
  },
  {
    id: 5,
    type: "document",
    title: "Floor Plans",
    thumbnail: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    locked: true
  },
  {
    id: 6,
    type: "image",
    title: "Backyard - Pool Area",
    thumbnail: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    locked: false
  }
];

export function ContentDelivery() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const filteredContent = activeTab === "all" 
    ? contentItems 
    : contentItems.filter(item => item.type === activeTab);

  const handleDownload = (item: typeof contentItems[0]) => {
    if (item.locked) {
      toast({
        title: "Content Locked",
        description: "This item requires payment before download. Please contact your agent.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Download Started",
        description: `Downloading ${item.title}...`,
      });
    }
  };

  const handlePreview = (item: typeof contentItems[0]) => {
    toast({
      title: "Preview",
      description: `Previewing ${item.title}...`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">123 Main Street</h2>
          <p className="text-muted-foreground">Luxury Family Home</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="image">Photos</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <GlassCard 
                key={item.id} 
                className="overflow-hidden"
                hoverEffect
              >
                <div className="relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  {item.locked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreview(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      variant={item.locked ? "outline" : "default"}
                      onClick={() => handleDownload(item)}
                    >
                      {item.locked ? (
                        <>
                          <Lock className="h-4 w-4 mr-1" />
                          Locked
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
