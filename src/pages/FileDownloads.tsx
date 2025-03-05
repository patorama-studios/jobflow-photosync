import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Download, 
  FileText,
  Image,
  Video,
  File,
  FileImage,
  FileVideo,
  FileArchive,
  Check,
  Info,
  Loader2,
  Camera
} from 'lucide-react';

const FileDownloads: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders } = useSampleOrders();
  const [activeTab, setActiveTab] = useState('photos');
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [viewImageDialog, setViewImageDialog] = useState<number | null>(null);
  
  const order = orders.find(o => o.id === Number(orderId));
  
  if (!order) {
    return (
      <SidebarLayout>
        <PageTransition>
          <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 mr-4"
                onClick={() => navigate('/orders')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Button>
              <h1 className="text-3xl font-semibold">Files Not Found</h1>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p>The order files you're looking for don't exist or have been removed.</p>
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </SidebarLayout>
    );
  }

  // Simulate file data
  const photoFiles = Array(8).fill(null).map((_, idx) => ({
    id: `photo-${idx}`,
    name: `Property Photo ${idx + 1}.jpg`,
    size: `${Math.floor(Math.random() * 10) + 2} MB`,
    type: 'image',
    uploadDate: new Date(new Date().getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000)
  }));

  const videoFiles = Array(2).fill(null).map((_, idx) => ({
    id: `video-${idx}`,
    name: `Property Video ${idx + 1}.mp4`,
    size: `${Math.floor(Math.random() * 200) + 50} MB`,
    type: 'video',
    uploadDate: new Date(new Date().getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000)
  }));

  const documentFiles = [
    {
      id: 'doc-1',
      name: 'Floor Plan.pdf',
      size: '1.2 MB',
      type: 'document',
      uploadDate: new Date(new Date().getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'doc-2',
      name: 'Property Details.pdf',
      size: '0.8 MB',
      type: 'document',
      uploadDate: new Date(new Date().getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000)
    }
  ];

  const handleDownload = (index: number) => {
    setDownloadingIndex(index);
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your file has been downloaded successfully",
      });
      setDownloadingIndex(null);
    }, 1500);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <FileImage className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-8 w-8 text-purple-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <SidebarLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 mr-4"
              onClick={() => navigate(`/orders/${orderId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Order Details
            </Button>
            <h1 className="text-3xl font-semibold">Order Files</h1>
            <div className="ml-auto">
              <Button className="flex items-center gap-2">
                <FileArchive className="h-4 w-4" />
                Download All Files
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order {order.orderNumber}</CardTitle>
              <CardDescription>{order.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{order.client}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Photographer</p>
                  <p className="font-medium">{order.photographer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shoot Date</p>
                  <p className="font-medium">{format(new Date(order.scheduledDate), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="photos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="photos" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                Photos ({photoFiles.length})
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                Videos ({videoFiles.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Documents ({documentFiles.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {photoFiles.map((file, index) => (
                  <Card key={file.id} className="overflow-hidden">
                    <div 
                      className="aspect-square bg-muted flex items-center justify-center cursor-pointer"
                      onClick={() => setViewImageDialog(index)}
                    >
                      <Camera className="h-12 w-12 text-muted-foreground opacity-40" />
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="truncate">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => handleDownload(index)}
                          disabled={downloadingIndex === index}
                        >
                          {downloadingIndex === index ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              <div className="space-y-4">
                {videoFiles.map((file, index) => (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {format(file.uploadDate, 'MMM d, yyyy')}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handleDownload(index + photoFiles.length)}
                          disabled={downloadingIndex === index + photoFiles.length}
                        >
                          {downloadingIndex === index + photoFiles.length ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Downloading</>
                          ) : (
                            <><Download className="h-4 w-4" /> Download</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-4">
                {documentFiles.map((file, index) => (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {format(file.uploadDate, 'MMM d, yyyy')}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handleDownload(index + photoFiles.length + videoFiles.length)}
                          disabled={downloadingIndex === index + photoFiles.length + videoFiles.length}
                        >
                          {downloadingIndex === index + photoFiles.length + videoFiles.length ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Downloading</>
                          ) : (
                            <><Download className="h-4 w-4" /> Download</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Usage Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">These files are provided for use in accordance with your service agreement. All rights reserved.</p>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-4 w-4 text-green-500" />
                <span>Downloads available until {format(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy')}</span>
              </div>
            </CardFooter>
          </Card>

          {/* View Image Dialog */}
          <Dialog open={viewImageDialog !== null} onOpenChange={() => setViewImageDialog(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {viewImageDialog !== null && photoFiles[viewImageDialog]?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Camera className="h-16 w-16 text-muted-foreground opacity-20" />
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => viewImageDialog !== null && handleDownload(viewImageDialog)}
                >
                  <Download className="h-4 w-4" /> Download Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default FileDownloads;
