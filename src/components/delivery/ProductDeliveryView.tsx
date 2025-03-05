
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Link as LinkIcon,
  CreditCard,
  DollarSign,
  Play,
  Maximize,
  Camera,
  FileImage,
  FileVideo,
  File,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCustomers } from "@/components/clients/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PhotoSection } from "@/components/delivery/PhotoSection";
import { VideoSection } from "@/components/delivery/VideoSection";
import { FloorPlanSection } from "@/components/delivery/FloorPlanSection";
import { LinksSection } from "@/components/delivery/LinksSection";
import { PaymentSection } from "@/components/delivery/PaymentSection";

interface ProductDeliveryViewProps {
  orderId?: string;
}

// Define more specific video orientation type
interface VideoItem {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  orientation: "horizontal" | "vertical";
}

export function ProductDeliveryView({ orderId }: ProductDeliveryViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("photos");
  const [contentLocked, setContentLocked] = useState(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  // Mock order data (would be fetched based on orderId in a real app)
  const order = {
    id: orderId || "ord-1",
    orderNumber: "ORD-001",
    address: "123 Main St, Anytown, CA",
    customer: "ABC Properties",
    customerCompany: "XYZ Real Estate",
    shotOnDate: "2023-06-15",
    totalAmount: 520,
    amountPaid: 0,
    paymentStatus: "unpaid",
    paymentDueDate: "2023-07-15",
    paymentTerms: "30days",
    photos: [
      { id: "photo1", url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80", title: "Living Room" },
      { id: "photo2", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", title: "Kitchen" },
      { id: "photo3", url: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", title: "Bedroom" },
      { id: "photo4", url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", title: "Bathroom" },
      { id: "photo5", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", title: "Exterior Front" },
    ],
    videos: [
      { id: "video1", url: "https://example.com/video1.mp4", thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80", title: "Property Tour", orientation: "horizontal" as "horizontal" | "vertical" },
      { id: "video2", url: "https://example.com/video2.mp4", thumbnail: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", title: "Kitchen Showcase", orientation: "vertical" as "horizontal" | "vertical" },
    ],
    floorPlans: [
      { id: "fp1", imageUrl: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", pdfUrl: "https://example.com/floorplan.pdf", title: "Main Floor" },
    ],
    links: [
      { id: "link1", url: "https://example.com/doc1.pdf", title: "Property Details PDF", type: "pdf" },
      { id: "link2", url: "https://example.com/virtualtour", title: "360° Virtual Tour", type: "virtual-tour", embeddable: true },
      { id: "link3", url: "https://example.com/brochure.pdf", title: "Marketing Brochure", type: "pdf" },
    ],
    invoiceItems: [
      { id: "item1", description: "Professional Photography", amount: 250 },
      { id: "item2", description: "Video Tour", amount: 150 },
      { id: "item3", description: "Floor Plan", amount: 120 },
    ]
  };
  
  // Set the hero image to the first photo
  useEffect(() => {
    if (order.photos && order.photos.length > 0) {
      setHeroImage(order.photos[0].url);
    }
  }, [order.photos]);
  
  // Function to check if download is allowed
  const isDownloadAllowed = () => {
    // In a real application, this would check the client's download settings
    // For now, just use our contentLocked state as a simple toggle
    return !contentLocked;
  };
  
  // Mock function to toggle content lock (for demonstration)
  const handleToggleContentLock = () => {
    setContentLocked(!contentLocked);
    toast({
      title: contentLocked ? "Content Unlocked" : "Content Locked", 
      description: contentLocked 
        ? "Client can now download content regardless of payment status." 
        : "Content will require payment before download.",
    });
  };
  
  const handleOpenFullscreen = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
    setShowImagePreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(`/orders/${orderId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Content Delivery: {order.orderNumber}</h1>
            <p className="text-muted-foreground">{order.address}</p>
          </div>
          <Badge 
            variant={contentLocked ? "destructive" : "outline"}
            className={contentLocked ? "" : "bg-green-100 text-green-700"}
          >
            {contentLocked ? (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Content Locked
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3 mr-1" />
                Content Unlocked
              </>
            )}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToggleContentLock}
          >
            {contentLocked ? (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Content
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Lock Content
              </>
            )}
          </Button>
          <Link to={`/production/order/${order.id}`}>
            <Button variant="outline" size="sm">
              View in Production
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image Section */}
      {heroImage && (
        <Card className="overflow-hidden">
          <div className="relative h-[300px] md:h-[400px] w-full">
            <img 
              src={heroImage} 
              alt="Property Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold">{order.address}</h2>
                <p className="opacity-90">{order.customer} - {order.customerCompany}</p>
              </div>
            </div>
          </div>
          <CardContent className="py-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setActiveTab("photos")}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photos
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("videos")}
              >
                <Video className="h-4 w-4 mr-2" />
                Videos
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("floorplans")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Floor Plans
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("links")}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Links & Documents
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("payment")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Photos</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="floorplans" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Floor Plans</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="photos">
          <PhotoSection 
            photos={order.photos} 
            isDownloadAllowed={isDownloadAllowed()} 
            contentLocked={contentLocked}
            onOpenFullscreen={handleOpenFullscreen}
          />
        </TabsContent>
        
        <TabsContent value="videos">
          <VideoSection 
            videos={order.videos} 
            isDownloadAllowed={isDownloadAllowed()} 
            contentLocked={contentLocked}
          />
        </TabsContent>
        
        <TabsContent value="floorplans">
          <FloorPlanSection 
            floorPlans={order.floorPlans} 
            isDownloadAllowed={isDownloadAllowed()} 
            contentLocked={contentLocked}
          />
        </TabsContent>
        
        <TabsContent value="links">
          <LinksSection 
            links={order.links} 
            isDownloadAllowed={isDownloadAllowed()} 
            contentLocked={contentLocked}
          />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSection 
            order={order} 
            onPaymentComplete={() => setContentLocked(false)}
          />
        </TabsContent>
      </Tabs>

      {/* Fullscreen Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="relative">
            {fullscreenImage && (
              <img 
                src={fullscreenImage} 
                alt="Preview" 
                className="w-full object-contain max-h-[80vh]"
              />
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={() => setShowImagePreview(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
