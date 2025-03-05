
import { useState } from "react";
import { Download, Lock, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  url: string;
  title: string;
}

interface PhotoSectionProps {
  photos: Photo[];
  isDownloadAllowed: boolean;
  contentLocked: boolean;
  onOpenFullscreen: (imageUrl: string) => void;
}

export function PhotoSection({ photos, isDownloadAllowed, contentLocked, onOpenFullscreen }: PhotoSectionProps) {
  const { toast } = useToast();
  
  const handleDownload = (photo: Photo, quality: 'high' | 'low') => {
    if (!isDownloadAllowed) {
      toast({
        title: "Download Restricted",
        description: "Content is locked. Please complete payment to download.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would initiate an actual download with the correct file
    toast({
      title: "Downloading Photo",
      description: `Downloading ${quality}-resolution version of ${photo.title}`,
    });
    
    // Mock download - in a real app, this would be replaced with actual download code
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}-${quality}-res.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Property Photos
          </h2>
          {contentLocked && (
            <div className="text-sm text-amber-600 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              Downloads require payment
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="rounded-lg overflow-hidden border bg-card">
              <div 
                className="aspect-[4/3] relative cursor-pointer" 
                onClick={() => onOpenFullscreen(photo.url)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                  <Button variant="secondary" size="sm">View Fullscreen</Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium mb-2">{photo.title}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(photo, 'high')}
                    disabled={contentLocked}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    High-Res
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(photo, 'low')}
                    disabled={contentLocked}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Low-Res
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
