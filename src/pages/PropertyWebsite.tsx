
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  Clock,
  Calendar,
  Camera,
  Video,
  FileText,
} from 'lucide-react';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PropertyWebsite: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders } = useSampleOrders();
  
  const order = orders.find(o => o.id === Number(orderId));
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>
            Return to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Generate placeholder images for the gallery
  const galleryImages = Array(12).fill(null).map((_, index) => (
    <div key={index} className="aspect-square bg-muted rounded-md flex items-center justify-center">
      <Camera className="h-8 w-8 text-muted-foreground opacity-50" />
    </div>
  ));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate(`/orders/${orderId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Order
          </Button>
          
          <div className="font-semibold">{order.address}</div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Share</Button>
            <Button size="sm">Contact Agent</Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh] bg-muted flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className="h-32 w-32 text-muted-foreground opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{order.address}</h1>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-white/80" />
            <span>{order.address}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-md">
              <div className="text-sm text-white/70">Property Type</div>
              <div className="font-semibold">{order.propertyType}</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-md">
              <div className="text-sm text-white/70">Size</div>
              <div className="font-semibold">{order.squareFeet} sq ft</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-md">
              <div className="text-sm text-white/70">Photographed</div>
              <div className="font-semibold">{format(new Date(order.scheduledDate), 'MMMM d, yyyy')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-10 bg-background shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto py-4 gap-6 text-sm font-medium">
            <a href="#photos" className="flex items-center gap-1 whitespace-nowrap px-2 border-b-2 border-primary">
              <Camera className="h-4 w-4" />
              Photos
            </a>
            <a href="#videos" className="flex items-center gap-1 whitespace-nowrap px-2">
              <Video className="h-4 w-4" />
              Videos
            </a>
            <a href="#details" className="flex items-center gap-1 whitespace-nowrap px-2">
              <FileText className="h-4 w-4" />
              Details
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-8 space-y-12">
        {/* Photos Section */}
        <section id="photos" className="scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Property Photos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages}
          </div>
        </section>

        <Separator />

        {/* Videos Section */}
        <section id="videos" className="scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Video className="h-6 w-6" />
            Property Videos
          </h2>
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        </section>

        <Separator />

        {/* Details Section */}
        <section id="details" className="scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Property Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium">{order.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Square Footage</span>
                  <span className="font-medium">{order.squareFeet} sq ft</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Photographer</span>
                  <span className="font-medium">{order.photographer}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Photo Date</span>
                  <span className="font-medium">{format(new Date(order.scheduledDate), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
              <p className="mt-2 text-muted-foreground">{order.address}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="font-semibold text-lg">Property Website</h3>
              <p className="text-muted-foreground text-sm">Order #{order.orderNumber}</p>
            </div>
            
            <div className="text-center md:text-right">
              <Button variant="outline" size="sm" className="flex items-center gap-1 mb-2">
                <Calendar className="h-4 w-4" />
                Schedule a Visit
              </Button>
              <p className="text-xs text-muted-foreground">
                Images and content on this page are property of the owner.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyWebsite;
