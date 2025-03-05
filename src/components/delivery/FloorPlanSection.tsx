
import { Download, Lock, FileText, File, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FloorPlan {
  id: string;
  imageUrl: string;
  pdfUrl: string;
  title: string;
  boxFolderId?: string; // Box folder ID
}

interface FloorPlanSectionProps {
  floorPlans: FloorPlan[];
  isDownloadAllowed: boolean;
  contentLocked: boolean;
  orderNumber?: string;
  propertyAddress?: string;
}

export function FloorPlanSection({ 
  floorPlans, 
  isDownloadAllowed, 
  contentLocked, 
  orderNumber, 
  propertyAddress 
}: FloorPlanSectionProps) {
  const { toast } = useToast();
  
  const handleDownload = (floorPlan: FloorPlan, type: 'pdf' | 'image') => {
    if (!isDownloadAllowed) {
      toast({
        title: "Download Restricted",
        description: "Content is locked. Please complete payment to download.",
        variant: "destructive",
      });
      return;
    }
    
    const url = type === 'pdf' ? floorPlan.pdfUrl : floorPlan.imageUrl;
    const fileExt = type === 'pdf' ? 'pdf' : 'jpg';
    
    toast({
      title: "Downloading Floor Plan",
      description: `Downloading ${type === 'pdf' ? 'PDF' : 'image'} version of ${floorPlan.title}`,
    });
    
    // Mock download - in a real app, this would be replaced with actual download code
    const link = document.createElement('a');
    link.href = url;
    link.download = `${floorPlan.title}.${fileExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const openBoxFolder = (floorPlan: FloorPlan) => {
    if (!isDownloadAllowed) {
      toast({
        title: "Access Restricted",
        description: "Content is locked. Please complete payment to access.",
        variant: "destructive",
      });
      return;
    }
    
    if (floorPlan.boxFolderId) {
      toast({
        title: "Opening Box Folder",
        description: `Opening Box folder for ${floorPlan.title}`,
      });
      
      // Open Box folder in a new tab
      window.open(`https://app.box.com/folder/${floorPlan.boxFolderId}`, '_blank');
    } else {
      toast({
        title: "Box Folder Not Available",
        description: "The Box folder for this floor plan is not available.",
        variant: "destructive",
      });
    }
  };
  
  // Generate Box folder name based on order number and property address
  const getBoxFolderName = () => {
    if (orderNumber && propertyAddress) {
      return `[${orderNumber}] - ${propertyAddress}`;
    }
    return "Floor Plans Folder";
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Floor Plans
          </h2>
          {contentLocked && (
            <div className="text-sm text-amber-600 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              Downloads require payment
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {floorPlans.map((floorPlan) => (
            <div key={floorPlan.id} className="rounded-lg overflow-hidden border bg-card">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 relative">
                  <img 
                    src={floorPlan.imageUrl} 
                    alt={floorPlan.title} 
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </div>
                <div className="p-4 md:w-1/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{floorPlan.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Floor plan available in PDF and image formats
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="default" 
                      onClick={() => handleDownload(floorPlan, 'pdf')}
                      disabled={contentLocked}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownload(floorPlan, 'image')}
                      disabled={contentLocked}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="secondary" 
                            onClick={() => openBoxFolder(floorPlan)}
                            disabled={contentLocked || !floorPlan.boxFolderId}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in Box
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open in Box: {getBoxFolderName()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {floorPlans.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">No Floor Plans Available</h3>
              <p>No floor plans have been uploaded for this property.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
