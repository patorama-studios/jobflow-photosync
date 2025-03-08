
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface StepItem {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error' | 'skipped';
}

interface UploadState {
  currentStep: number;
  steps: StepItem[];
  orderId: string;
  productId?: string;
}

export const ProductUploadStepsView = () => {
  const { orderId, productId } = useParams<{ orderId: string; productId?: string }>();
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<UploadState>({
    currentStep: 0,
    steps: [],
    orderId: orderId || ''
  });
  
  // Fetch order details
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
      }
    },
    enabled: !!orderId
  });
  
  // Fetch ordered products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['orderProducts', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching order products:', error);
        return [];
      }
    },
    enabled: !!orderId
  });
  
  // Initialize upload steps based on products
  useEffect(() => {
    if (products && products.length > 0) {
      // Create steps based on products
      const steps: StepItem[] = products.map((product, index) => ({
        id: product.id,
        name: product.name,
        description: `Upload and process ${product.name.toLowerCase()}`,
        status: index === 0 ? 'active' : 'pending'
      }));
      
      // Set initial state
      setUploadState(prev => ({
        ...prev,
        steps,
        productId: productId || steps[0].id
      }));
    }
  }, [products, productId]);
  
  // Handle step navigation
  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= uploadState.steps.length) return;
    
    const newSteps = [...uploadState.steps];
    
    // Update current step status
    const currentStep = newSteps[uploadState.currentStep];
    if (currentStep.status === 'active') {
      currentStep.status = 'pending';
    }
    
    // Update new step status
    newSteps[stepIndex].status = 'active';
    
    setUploadState({
      ...uploadState,
      currentStep: stepIndex,
      steps: newSteps,
      productId: newSteps[stepIndex].id
    });
    
    // Update URL
    navigate(`/production/upload/${orderId}/${newSteps[stepIndex].id}`);
  };
  
  const goToNextStep = () => {
    // Mark current step as completed
    const newSteps = [...uploadState.steps];
    newSteps[uploadState.currentStep].status = 'completed';
    
    // Go to next step if available
    if (uploadState.currentStep < uploadState.steps.length - 1) {
      const nextStep = uploadState.currentStep + 1;
      newSteps[nextStep].status = 'active';
      
      setUploadState({
        ...uploadState,
        currentStep: nextStep,
        steps: newSteps,
        productId: newSteps[nextStep].id
      });
      
      // Update URL
      navigate(`/production/upload/${orderId}/${newSteps[nextStep].id}`);
    } else {
      // All steps completed
      setUploadState({
        ...uploadState,
        steps: newSteps
      });
      
      toast.success("All uploads completed successfully!");
      // Navigate back to order
      setTimeout(() => navigate(`/order/${orderId}`), 1500);
    }
  };
  
  const skipCurrentStep = () => {
    // Mark current step as skipped
    const newSteps = [...uploadState.steps];
    newSteps[uploadState.currentStep].status = 'skipped';
    
    // Go to next step if available
    if (uploadState.currentStep < uploadState.steps.length - 1) {
      const nextStep = uploadState.currentStep + 1;
      newSteps[nextStep].status = 'active';
      
      setUploadState({
        ...uploadState,
        currentStep: nextStep,
        steps: newSteps,
        productId: newSteps[nextStep].id
      });
      
      // Update URL
      navigate(`/production/upload/${orderId}/${newSteps[nextStep].id}`);
    } else {
      // All steps completed
      setUploadState({
        ...uploadState,
        steps: newSteps
      });
      
      toast.success("Upload process completed!");
      // Navigate back to order
      setTimeout(() => navigate(`/order/${orderId}`), 1500);
    }
  };
  
  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'active':
        return <Upload className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'skipped':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Function to get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-gray-200 bg-gray-50 text-gray-700';
      case 'active':
        return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'completed':
        return 'border-green-300 bg-green-50 text-green-700';
      case 'error':
        return 'border-red-300 bg-red-50 text-red-700';
      case 'skipped':
        return 'border-amber-300 bg-amber-50 text-amber-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };
  
  // Determine the current step content
  const getCurrentStepContent = () => {
    if (uploadState.steps.length === 0 || uploadState.currentStep >= uploadState.steps.length) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No upload steps available</p>
        </div>
      );
    }
    
    const currentStep = uploadState.steps[uploadState.currentStep];
    
    // Placeholder for different upload types - in a real app, we'd render different components
    switch (currentStep.name.toLowerCase()) {
      case 'photography':
      case 'professional photography':
      case 'photo':
      case 'photos':
        return <PhotoUploadContent productId={currentStep.id} orderId={orderId || ''} />;
      case 'floor plan':
      case 'floorplan':
        return <FloorPlanUploadContent productId={currentStep.id} orderId={orderId || ''} />;
      case 'video':
      case 'video tour':
        return <VideoUploadContent productId={currentStep.id} orderId={orderId || ''} />;
      case 'virtual tour':
        return <VirtualTourUploadContent productId={currentStep.id} orderId={orderId || ''} />;
      default:
        return <GenericUploadContent productId={currentStep.id} orderId={orderId || ''} productName={currentStep.name} />;
    }
  };
  
  const isLoading = orderLoading || productsLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="flex gap-4">
          <div className="w-1/4">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="w-3/4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/order/${orderId}`)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order
          </Button>
          <h1 className="text-3xl font-bold">Upload Order</h1>
          <p className="text-muted-foreground">
            {order ? `Order #${order.order_number} - ${order.address}` : 'Upload Content'}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          {uploadState.steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${index === uploadState.currentStep 
                  ? 'bg-blue-500 text-white' 
                  : step.status === 'completed' 
                    ? 'bg-green-500 text-white'
                    : step.status === 'error'
                      ? 'bg-red-500 text-white'
                      : step.status === 'skipped'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with upload steps */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Steps</CardTitle>
              <CardDescription>
                Complete each step to finish the upload process
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {uploadState.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={`w-full flex items-center px-4 py-3 text-left border-l-4 ${
                      index === uploadState.currentStep
                        ? 'border-l-blue-500 bg-blue-50'
                        : `border-l-transparent hover:bg-gray-50 ${
                            step.status === 'completed' ? 'bg-green-50' : 
                            step.status === 'error' ? 'bg-red-50' :
                            step.status === 'skipped' ? 'bg-amber-50' : ''
                          }`
                    }`}
                  >
                    <div className="mr-3">{getStatusIcon(step.status)}</div>
                    <div>
                      <div className="font-medium">{step.name}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-muted-foreground">Not yet at stage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground">Currently finishing upload</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Stage finished and ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-muted-foreground">Skipped section or error</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {uploadState.steps[uploadState.currentStep]?.name || 'Upload Content'}
              </CardTitle>
              <CardDescription>
                {uploadState.steps[uploadState.currentStep]?.description || 'Upload and process product content'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getCurrentStepContent()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => goToStep(uploadState.currentStep - 1)}
                disabled={uploadState.currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Step
              </Button>
              
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={skipCurrentStep}
                >
                  Skip
                </Button>
                <Button 
                  onClick={goToNextStep}
                >
                  {uploadState.currentStep === uploadState.steps.length - 1 ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Complete Upload
                    </>
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Photo Upload Content Component
const PhotoUploadContent = ({ productId, orderId }: { productId: string, orderId: string }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Upload Photos</h3>
      <p className="text-muted-foreground">Please convert raw photos to .dng files before uploading</p>
      
      {/* Drag and drop area */}
      <div className="border-2 border-dashed border-blue-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
        <Upload className="h-12 w-12 text-blue-500 mb-4" />
        <p className="text-lg font-medium">Drag & Drop .dng raw files</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
      
      {/* Successfully uploaded files preview */}
      <div>
        <h4 className="font-medium mb-2">Successfully Uploaded</h4>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="aspect-square border rounded-md bg-gray-50"></div>
          ))}
        </div>
      </div>
      
      {/* Editing notes */}
      <div>
        <h4 className="font-medium mb-2">Editing Notes</h4>
        <textarea 
          className="w-full p-3 border rounded-md h-24" 
          placeholder="Add notes for the editor..."
        ></textarea>
      </div>
    </div>
  );
};

// Floor Plan Upload Content Component
const FloorPlanUploadContent = ({ productId, orderId }: { productId: string, orderId: string }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Upload Floor Plan</h3>
      <p className="text-muted-foreground">Please select floor plan upload method</p>
      
      {/* Floor plan upload methods */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedMethod === 'pdf' ? 'default' : 'outline'} 
          onClick={() => setSelectedMethod('pdf')}
        >
          PDF File upload method
        </Button>
        <Button 
          variant={selectedMethod === 'pdf-map' ? 'default' : 'outline'} 
          onClick={() => setSelectedMethod('pdf-map')}
        >
          PDF File upload method With Site map
        </Button>
        <Button 
          variant={selectedMethod === 'polycam' ? 'default' : 'outline'} 
          onClick={() => setSelectedMethod('polycam')}
        >
          Polycam Method
        </Button>
        <Button 
          variant={selectedMethod === 'polycam-map' ? 'default' : 'outline'} 
          onClick={() => setSelectedMethod('polycam-map')}
        >
          Polycam Method with sitemap
        </Button>
      </div>
      
      {/* Drag and drop area */}
      <div className="border-2 border-dashed border-blue-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
        <Upload className="h-12 w-12 text-blue-500 mb-4" />
        <p className="text-lg font-medium">Drag & Drop</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
      
      {/* Successfully uploaded files preview */}
      <div>
        <h4 className="font-medium mb-2">Successfully Uploaded</h4>
        <div className="grid grid-cols-5 gap-3">
          {/* Empty preview boxes */}
        </div>
      </div>
      
      {/* Editing notes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Editing Notes</h4>
          <textarea 
            className="w-full p-3 border rounded-md h-24" 
            placeholder="Add notes for the editor..."
          ></textarea>
        </div>
        <div>
          <h4 className="font-medium mb-2">Style Code</h4>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md" 
            placeholder="Enter style code..."
            defaultValue="MO507"
          />
        </div>
      </div>
    </div>
  );
};

// Video Upload Content Component
const VideoUploadContent = ({ productId, orderId }: { productId: string, orderId: string }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Upload Video</h3>
      <p className="text-muted-foreground">Add videos to correct video type</p>
      
      {/* Video type selection */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedType === 'landscape-teaser' ? 'default' : 'outline'} 
          onClick={() => setSelectedType('landscape-teaser')}
        >
          Landscape Teaser
        </Button>
        <Button 
          variant={selectedType === 'landscape-full' ? 'default' : 'outline'} 
          onClick={() => setSelectedType('landscape-full')}
        >
          Landscape Full Length
        </Button>
        <Button 
          variant={selectedType === 'landscape-both' ? 'default' : 'outline'} 
          onClick={() => setSelectedType('landscape-both')}
        >
          Landscape both
        </Button>
        <Button 
          variant={selectedType === 'vertical-teaser' ? 'default' : 'outline'} 
          onClick={() => setSelectedType('vertical-teaser')}
        >
          Vertical Teaser
        </Button>
        <Button 
          variant={selectedType === 'vertical-full' ? 'default' : 'outline'} 
          onClick={() => setSelectedType('vertical-full')}
        >
          Vertical Full
        </Button>
        <Button 
          variant={selectedType === 'reels' ? 'default' : 'outline'} 
          onClick={() => setSelectedType('reels')}
        >
          Reels Bundle
        </Button>
      </div>
      
      {/* Drag and drop areas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="border-2 border-dashed border-blue-300 rounded-md p-6 flex flex-col items-center justify-center h-48">
            <Upload className="h-10 w-10 text-blue-500 mb-3" />
            <p className="text-base font-medium">Drag & Drop</p>
          </div>
          <p className="text-center mt-3">Landscape Successfully Uploaded</p>
        </div>
        
        <div>
          <div className="border-2 border-dashed border-blue-300 rounded-md p-6 flex flex-col items-center justify-center h-48">
            <Upload className="h-10 w-10 text-blue-500 mb-3" />
            <p className="text-base font-medium">Drag & Drop</p>
          </div>
          <p className="text-center mt-3">Vertical Successfully Uploaded</p>
        </div>
      </div>
      
      {/* Preview grid */}
      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="aspect-square border rounded-md bg-gray-50"></div>
        ))}
      </div>
      
      {/* Editing notes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Editing Notes</h4>
          <textarea 
            className="w-full p-3 border rounded-md h-24" 
            placeholder="Add notes for the editor..."
          ></textarea>
        </div>
        <div>
          <h4 className="font-medium mb-2">Style Code</h4>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md" 
            placeholder="Enter style code..."
            defaultValue="MO507"
          />
        </div>
      </div>
    </div>
  );
};

// Virtual Tour Upload Content Component
const VirtualTourUploadContent = ({ productId, orderId }: { productId: string, orderId: string }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Upload Virtual Tour</h3>
      <p className="text-muted-foreground">Upload necessary files for virtual tour creation</p>
      
      {/* Drag and drop area */}
      <div className="border-2 border-dashed border-blue-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
        <Upload className="h-12 w-12 text-blue-500 mb-4" />
        <p className="text-lg font-medium">Drag & Drop</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
      
      {/* Upload info */}
      <div className="bg-muted/20 p-4 rounded-md">
        <h4 className="font-medium mb-2">Hot Spots Required: 5</h4>
        <p className="text-sm text-muted-foreground">Please ensure all key areas of the property are covered</p>
      </div>
      
      {/* Editing notes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Editing Notes</h4>
          <textarea 
            className="w-full p-3 border rounded-md h-24" 
            placeholder="Add notes for the editor..."
          ></textarea>
        </div>
        <div>
          <h4 className="font-medium mb-2">Style Code</h4>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md" 
            placeholder="Enter style code..."
            defaultValue="MO507"
          />
        </div>
      </div>
    </div>
  );
};

// Generic Upload Content Component
const GenericUploadContent = ({ productId, orderId, productName }: { productId: string, orderId: string, productName: string }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Upload {productName}</h3>
      <p className="text-muted-foreground">Upload content for {productName}</p>
      
      {/* Drag and drop area */}
      <div className="border-2 border-dashed border-blue-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
        <Upload className="h-12 w-12 text-blue-500 mb-4" />
        <p className="text-lg font-medium">Drag & Drop Files</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
      
      {/* Editing notes */}
      <div>
        <h4 className="font-medium mb-2">Editing Notes</h4>
        <textarea 
          className="w-full p-3 border rounded-md h-24" 
          placeholder="Add notes for the editor..."
        ></textarea>
      </div>
    </div>
  );
};
