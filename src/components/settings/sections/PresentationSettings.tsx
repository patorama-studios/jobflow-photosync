
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Image, Video, Grid3X3, Maximize, ArrowUpDown,
  PanelTop, ChevronsUp, ChevronsDown
} from "lucide-react";

export function PresentationSettings() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Presentation settings updated",
      description: "Your order presentation settings have been saved.",
    });
  };
  
  const contentTypes = [
    { id: "photos", name: "Photos", icon: <Image className="h-5 w-5" /> },
    { id: "videos", name: "Videos", icon: <Video className="h-5 w-5" /> },
    { id: "floorPlans", name: "Floor Plans", icon: <Grid3X3 className="h-5 w-5" /> },
    { id: "panoramas", name: "Panoramas", icon: <Maximize className="h-5 w-5" /> },
  ];
  
  const imageGroups = [
    "Exterior Photos",
    "Interior Living Areas",
    "Kitchen",
    "Bedrooms",
    "Bathrooms",
    "Other Areas",
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Order Presentation Settings</h2>
        <p className="text-muted-foreground">
          Customize how delivered content is presented to customers
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Content Display Order</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop to change the order of content types
          </p>
          
          <div className="space-y-2 max-w-md">
            {contentTypes.map((type, index) => (
              <div 
                key={type.id}
                className="flex items-center justify-between p-3 bg-card border rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    {type.icon}
                  </div>
                  <span className="font-medium">{type.name}</span>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronsDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Standard Image Groups</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define standard image groups for organizing photos
          </p>
          
          <div className="space-y-2 max-w-md">
            {imageGroups.map((group, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-card border rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <PanelTop className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{group}</span>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-2">
              Add New Image Group
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Presentation Settings</Button>
      </div>
    </div>
  );
}
