
import { useState } from "react";
import { Download, Lock, Video, Play, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoItem {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  orientation: 'horizontal' | 'vertical';
}

interface VideoSectionProps {
  videos: VideoItem[];
  isDownloadAllowed: boolean;
  contentLocked: boolean;
}

export function VideoSection({ videos, isDownloadAllowed, contentLocked }: VideoSectionProps) {
  const { toast } = useToast();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleDownload = (video: VideoItem) => {
    if (!isDownloadAllowed) {
      toast({
        title: "Download Restricted",
        description: "Content is locked. Please complete payment to download.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Downloading Video",
      description: `Downloading video: ${video.title}`,
    });
    
    // Mock download - in a real app, this would be replaced with actual download code
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const openVideoPlayer = (video: VideoItem) => {
    setActiveVideo(video);
    setIsDialogOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Video className="h-5 w-5" />
              Property Videos
            </h2>
            {contentLocked && (
              <div className="text-sm text-amber-600 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                Downloads require payment
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {videos.map((video) => (
              <div key={video.id} className="rounded-lg overflow-hidden border bg-card">
                <div className="flex flex-col md:flex-row">
                  <div 
                    className={`relative cursor-pointer ${
                      video.orientation === 'horizontal' 
                        ? 'md:w-2/3 aspect-video' 
                        : 'md:w-1/3 aspect-[9/16]'
                    }`}
                    onClick={() => openVideoPlayer(video)}
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 md:w-1/3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{video.title}</h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        {video.orientation === 'horizontal' ? 'Landscape' : 'Portrait'} video
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="default" 
                        onClick={() => openVideoPlayer(video)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play Video
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownload(video)}
                        disabled={contentLocked}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {videos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium">No Videos Available</h3>
                <p>No video content has been uploaded for this property.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Video Player Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {activeVideo && (
            <div className={activeVideo.orientation === 'horizontal' ? 'w-full' : 'max-w-md mx-auto'}>
              <div className="aspect-video bg-black flex items-center justify-center">
                {/* In a real app, this would be a proper video player */}
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video player would be implemented here</p>
                  <p className="text-sm text-gray-400 mt-2">{activeVideo.title}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
