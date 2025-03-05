
import { ExternalLink, Lock, LinkIcon, File, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Link {
  id: string;
  url: string;
  title: string;
  type: string;
  embeddable?: boolean;
  boxFolderId?: string; // Box folder ID
}

interface LinksSectionProps {
  links: Link[];
  isDownloadAllowed: boolean;
  contentLocked: boolean;
  orderNumber?: string;
  propertyAddress?: string;
}

export function LinksSection({ 
  links, 
  isDownloadAllowed, 
  contentLocked,
  orderNumber,
  propertyAddress 
}: LinksSectionProps) {
  const { toast } = useToast();
  
  const handleLinkClick = (link: Link) => {
    if (!isDownloadAllowed) {
      toast({
        title: "Access Restricted",
        description: "Content is locked. Please complete payment to access.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Opening Link",
      description: `Opening: ${link.title}`,
    });
    
    window.open(link.url, '_blank');
  };
  
  const openBoxFolder = (link: Link) => {
    if (!isDownloadAllowed) {
      toast({
        title: "Access Restricted",
        description: "Content is locked. Please complete payment to access.",
        variant: "destructive",
      });
      return;
    }
    
    if (link.boxFolderId) {
      toast({
        title: "Opening Box Folder",
        description: `Opening Box folder for ${link.title}`,
      });
      
      // Open Box folder in a new tab
      window.open(`https://app.box.com/folder/${link.boxFolderId}`, '_blank');
    } else {
      toast({
        title: "Box Folder Not Available",
        description: "The Box folder for this document is not available.",
        variant: "destructive",
      });
    }
  };
  
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="h-5 w-5" />;
      case 'virtual-tour':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Generate Box folder name based on order number and property address
  const getBoxFolderName = () => {
    if (orderNumber && propertyAddress) {
      return `[${orderNumber}] - ${propertyAddress}`;
    }
    return "Documents Folder";
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Documents & Links
          </h2>
          {contentLocked && (
            <div className="text-sm text-amber-600 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              Access requires payment
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {links.filter(link => link.embeddable).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Virtual Tour</h3>
              <div className="rounded-lg overflow-hidden border bg-card">
                <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                  {/* This would be the iframe for the virtual tour in a real app */}
                  <div className="text-center text-gray-500">
                    <LinkIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="font-medium">Virtual Tour Embed</p>
                    <p className="text-sm mt-1">
                      {contentLocked ? 
                        "Complete payment to access the virtual tour" : 
                        "Interactive 360° tour would be displayed here"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-medium mb-3">Available Downloads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((link) => (
              <Card key={link.id} className="overflow-hidden">
                <div className="p-4 flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded text-primary">
                    {getLinkIcon(link.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{link.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize mb-3">
                      {link.type.replace('-', ' ')}
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start"
                        onClick={() => handleLinkClick(link)}
                        disabled={contentLocked}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        {link.type === 'virtual-tour' ? 'Open Virtual Tour' : 'Download Document'}
                      </Button>
                      
                      {link.boxFolderId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-full text-left justify-start"
                                onClick={() => openBoxFolder(link)}
                                disabled={contentLocked}
                              >
                                <File className="h-3.5 w-3.5 mr-1" />
                                Open in Box
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open in Box: {getBoxFolderName()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {links.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">No Documents Available</h3>
              <p>No documents or external links have been uploaded for this property.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
