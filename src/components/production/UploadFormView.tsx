<lov-code>
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  Video, 
  Plane, 
  Compass,
  ChevronRight,
  ChevronLeft,
  Upload as UploadIcon,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UploadFormViewProps {
  orderId?: string;
  initialProductType?: string;
}

export function UploadFormView({ orderId, initialProductType }: UploadFormViewProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedProductType, setSelectedProductType] = useState(initialProductType || "photography");
  
  // Form state
  const [photoForm, setPhotoForm] = useState({
    bracketedPhotos: [] as File[],
    singlePhotos: [] as File[],
  });
  
  const [floorPlanForm, setFloorPlanForm] = useState({
    files: [] as File[],
    primaryLink: "",
    secondaryLinks: [""]
  });
  
  const [videoForm, setVideoForm] = useState({
    droneFootage: [] as File[],
    verticalFootage: [] as File[],
    landscapeFootage: [] as File[],
    notes: "",
    musicPreference: ""
  });
  
  // Mock order data
  const order = {
    id: orderId || "ord-1",
    orderNumber: "ORD-001",
    address: "123 Main St, Anytown, CA"
  };
  
  // Product type limits (for demonstration)
  const productLimits = {
    photography: 30, // 30 photos limit
    floorplan: 5,    // 5 files limit
    video: 20        // 20 files total limit
  };
  
  const steps = [
    "Select Product Type",
    `Upload ${selectedProductType.charAt(0).toUpperCase() + selectedProductType.slice(1)} Files`,
    "Review & Submit"
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleProductTypeSelect = (type: string) => {
    setSelectedProductType(type);
  };
  
  const handlePhotoBracketedChange = useCallback((files: FileList | null) => {
    if (files) {
      setPhotoForm(prev => ({ 
        ...prev, 
        bracketedPhotos: [...prev.bracketedPhotos, ...Array.from(files)] 
      }));
      
      // Simulate upload progress
      simulateUploadProgress();
    }
  }, []);
  
  const handlePhotoSingleChange = useCallback((files: FileList | null) => {
    if (files) {
      setPhotoForm(prev => ({ 
        ...prev, 
        singlePhotos: [...prev.singlePhotos, ...Array.from(files)] 
      }));
      
      // Simulate upload progress
      simulateUploadProgress();
    }
  }, []);
  
  const handleFloorPlanChange = useCallback((files: FileList | null) => {
    if (files) {
      setFloorPlanForm(prev => ({ 
        ...prev, 
        files: [...prev.files, ...Array.from(files)] 
      }));
      
      // Simulate upload progress
      simulateUploadProgress();
    }
  }, []);
  
  const handleVideoChange = useCallback((type: string, files: FileList | null) => {
    if (files) {
      setVideoForm(prev => {
        if (type === "drone") {
          return { ...prev, droneFootage: [...prev.droneFootage, ...Array.from(files)] };
        } else if (type === "vertical") {
          return { ...prev, verticalFootage: [...prev.verticalFootage, ...Array.from(files)] };
        } else {
          return { ...prev, landscapeFootage: [...prev.landscapeFootage, ...Array.from(files)] };
        }
      });
      
      // Simulate upload progress
      simulateUploadProgress();
    }
  }, []);
  
  const handleAddLink = () => {
    setFloorPlanForm(prev => ({
      ...prev,
      secondaryLinks: [...prev.secondaryLinks, ""]
    }));
  };
  
  const handleLinkChange = (index: number, value: string) => {
    if (index === -1) {
      // Primary link
      setFloorPlanForm(prev => ({
        ...prev,
        primaryLink: value
      }));
    } else {
      // Secondary link
      setFloorPlanForm(prev => {
        const newLinks = [...prev.secondaryLinks];
        newLinks[index] = value;
        return {
          ...prev,
          secondaryLinks: newLinks
        };
      });
    }
  };
  
  const handleRemoveFile = (type: string, fileType: string, index: number) => {
    if (type === "photography") {
      setPhotoForm(prev => {
        if (fileType === "bracketed") {
          const newFiles = [...prev.bracketedPhotos];
          newFiles.splice(index, 1);
          return { ...prev, bracketedPhotos: newFiles };
        } else {
          const newFiles = [...prev.singlePhotos];
          newFiles.splice(index, 1);
          return { ...prev, singlePhotos: newFiles };
        }
      });
    } else if (type === "floorplan") {
      setFloorPlanForm(prev => {
        const newFiles = [...prev.files];
        newFiles.splice(index, 1);
        return { ...prev, files: newFiles };
      });
    } else if (type === "video") {
      setVideoForm(prev => {
        if (fileType === "drone") {
          const newFiles = [...prev.droneFootage];
          newFiles.splice(index, 1);
          return { ...prev, droneFootage: newFiles };
        } else if (fileType === "vertical") {
          const newFiles = [...prev.verticalFootage];
          newFiles.splice(index, 1);
          return { ...prev, verticalFootage: newFiles };
        } else {
          const newFiles = [...prev.landscapeFootage];
          newFiles.splice(index, 1);
          return { ...prev, landscapeFootage: newFiles };
        }
      });
    }
  };
  
  const simulateUploadProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsUploading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };
  
  const handleSubmit = () => {
    // Simulate submit process
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate completion
          setTimeout(() => {
            setIsUploading(false);
            toast({
              title: "Upload Complete",
              description: `Files for ${selectedProductType} have been uploaded successfully.`,
              variant: "default",
            });
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Helper to get icon for product type
  const getProductIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "photography":
        return <Camera className="h-5 w-5" />;
      case "floorplan":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "drone":
        return <Plane className="h-5 w-5" />;
      case "virtual-tour":
        return <Compass className="h-5 w-5" />;
      default:
        return <Camera className="h-5 w-5" />;
    }
  };
  
  // Calculate total files for a product type
  const getFileCount = (type: string) => {
    switch (type) {
      case "photography":
        return photoForm.bracketedPhotos.length + photoForm.singlePhotos.length;
      case "floorplan":
        return floorPlanForm.files.length;
      case "video":
        return videoForm.droneFootage.length + videoForm.verticalFootage.length + videoForm.landscapeFootage.length;
      default:
        return 0;
    }
  };
  
  // Check if over limit
  const isOverLimit = (type: string) => {
    const count = getFileCount(type);
    const limit = productLimits[type as keyof typeof productLimits] || 0;
    return count > limit;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/production/order/${orderId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Order
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">
          Upload Content - Order {order.orderNumber}
        </h1>
      </div>
      
      {/* Progress indicator */}
      <div className="flex justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? "bg-green-500 text-white" 
                  : index === currentStep 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className={`ml-2 ${index === currentStep ? "font-medium" : "text-gray-500"}`}>
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-grow mx-2 h-0.5 ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`} style={{ width: "4rem" }}></div>
            )}
          </div>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
          <CardDescription>
            {currentStep === 0 && "Select the type of content you want to upload"}
            {currentStep === 1 && `Upload your ${selectedProductType} files`}
            {currentStep === 2 && "Review your uploads and submit"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {["photography", "floorplan", "video", "drone", "virtual-tour"].map((type) => (
                <Button
                  key={type}
                  variant={selectedProductType === type ? "default" : "outline"}
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleProductTypeSelect(type)}
                >
                  {getProductIcon(type)}
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </Button>
              ))}
            </div>
          )}
          
          {currentStep === 1 && selectedProductType === "photography" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Bracketed Exposure Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your bracketed exposure photos. These will count as 1/3 of a final image.
                  </p>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      id="bracketed-photos"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoBracketedChange(e.target.files)}
                    />
                    <label htmlFor="bracketed-photos" className="cursor-pointer">
                      <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Drag & drop files or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supported formats: JPG, PNG, HEIC, RAW
                      </p>
                    </label>
                  </div>
                  
                  {photoForm.bracketedPhotos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Uploaded Bracketed Photos ({photoForm.bracketedPhotos.length}) 
                        <span className="ml-2 text-sm text-muted-foreground">
                          ≈ {Math.ceil(photoForm.bracketedPhotos.length / 3)} final images
                        </span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {photoForm.bracketedPhotos.slice(0, 12).map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-slate-100 rounded-md overflow-hidden border">
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            </div>
                            <button 
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveFile("photography", "bracketed", index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {photoForm.bracketedPhotos.length > 12 && (
                          <div className="aspect-square bg-slate-100 rounded-md overflow-hidden border flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{photoForm.bracketedPhotos.length - 12} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">Single Exposure Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your single exposure photos. Each will count as one final image.
                  </p>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      id="single-photos"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoSingleChange(e.target.files)}
                    />
                    <label htmlFor="single-photos" className="cursor-pointer">
                      <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Drag & drop files or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supported formats: JPG, PNG, HEIC, RAW
                      </p>
                    </label>
                  </div>
                  
                  {photoForm.singlePhotos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Uploaded Single Photos ({photoForm.singlePhotos.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {photoForm.singlePhotos.slice(0, 12).map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-slate-100 rounded-md overflow-hidden border">
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            </div>
                            <button 
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveFile("photography", "single", index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {photoForm.singlePhotos.length > 12 && (
                          <div className="aspect-square bg-slate-100 rounded-md overflow-hidden border flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{photoForm.singlePhotos.length - 12} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium flex items-center justify-between">
                    <span>Total Final Images</span>
                    <span className={`${isOverLimit("photography") ? "text-red-500" : ""}`}>
                      {Math.ceil(photoForm.bracketedPhotos.length / 3) + photoForm.singlePhotos.length} / {productLimits.photography}
                    </span>
                  </h4>
                  
                  {isOverLimit("photography") && (
                    <div className="mt-2 text-sm text-red-500">
                      You have exceeded the maximum number of allowed images. Please remove some files to continue.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 1 && selectedProductType === "floorplan" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Floor Plan Files</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your floor plan files or provide links to them.
                </p>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="floorplan-files"
                    multiple
                    accept=".pdf,.dwg,.dxf,.jpg,.png"
                    className="hidden"
                    onChange={(e) => handleFloorPlanChange(e.target.files)}
                  />
                  <label htmlFor="floorplan-files" className="cursor-pointer">
                    <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag & drop files or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PDF, DWG, DXF, JPG, PNG
                    </p>
                  </label>
                </div>
                
                {floorPlanForm.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Files ({floorPlanForm.files.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {floorPlanForm.files.map((file, index) => (
                        <div key={index} className="relative group bg-slate-50 rounded-md border p-3 flex items-center">
                          <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">{file.name}</span>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveFile("floorplan", "file", index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primary-link">Primary Link (Optional)</Label>
                  <Input 
                    id="primary-link" 
                    type="url" 
                    placeholder="https://example.com/floor-plan"
                    value={floorPlanForm.primaryLink}
                    onChange={(e) => handleLinkChange(-1, e.target.value)}
                  />
                </div>
                
                {floorPlanForm.secondaryLinks.map((link, index) => (
                  <div key={index}>
                    <Label htmlFor={`secondary-link-${index}`}>Additional Link {index + 1}</Label>
                    <Input 
                      id={`secondary-link-${index}`} 
                      type="url" 
                      placeholder="https://example.com/additional-resource"
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                    />
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddLink}
                >
                  Add Another Link
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 1 && selectedProductType === "video" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Drone Footage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload aerial or drone footage for the property.
                </p>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="drone-footage"
                    multiple
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoChange("drone", e.target.files)}
                  />
                  <label htmlFor="drone-footage" className="cursor-pointer">
                    <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag & drop files or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: MP4, MOV, AVI
                    </p>
                  </label>
                </div>
                
                {videoForm.droneFootage.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Drone Footage ({videoForm.droneFootage.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {videoForm.droneFootage.map((file, index) => (
                        <div key={index} className="relative group bg-slate-50 rounded-md border p-3 flex items-center">
                          <Video className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">{file.name}</span>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveFile("video", "drone", index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Vertical Footage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload vertical videos for social media or mobile viewing.
                </p>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="vertical-footage"
                    multiple
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoChange("vertical", e.target.files)}
                  />
                  <label htmlFor="vertical-footage" className="cursor-pointer">
                    <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag & drop files or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: MP4, MOV, AVI
                    </p>
                  </label>
                </div>
                
                {videoForm.verticalFootage.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Vertical Footage ({videoForm.verticalFootage.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {videoForm.verticalFootage.map((file, index) => (
                        <div key={index} className="relative group bg-slate-50 rounded-md border p-3 flex items-center">
                          <Video className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">{file.name}</span>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveFile("video", "vertical", index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Landscape Footage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload standard landscape videos for the property.
                </p>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="landscape-footage"
                    multiple
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoChange("landscape", e.target.files)}
                  />
                  <label htmlFor="landscape-footage" className="cursor-pointer">
                    <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag & drop files or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: MP4, MOV, AVI
                    </p>
                  </label>
                </div>
                
                {videoForm.landscapeFootage.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Landscape Footage ({videoForm.landscapeFootage.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {videoForm.landscapeFootage.map((file, index) => (
                        <div key={index} className="relative group bg-slate-50 rounded-md border p-3 flex items-center">
                          <Video className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">{file.name}</span>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveFile("video", "landscape", index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="music-preference">Music Preference (Optional)</Label>
                  <Input 
                    id="music-preference" 
                    placeholder="Enter preferred music style or specific track"
                    value={videoForm.musicPreference}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, musicPreference: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editing-notes">Editing Notes (Optional)</Label>
                  <Textarea 
                    id="editing-notes" 
                    placeholder="Add any specific editing instructions or requests..."
                    value={videoForm.notes}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium flex items-center justify-between">
                  <span>Total Video Files</span>
                  <span className={`${isOverLimit("video") ? "text-red-500" : ""}`}>
                    {getFileCount("video")} / {productLimits.video}
                  </span>
                </h4>
                
                {isOverLimit("video") && (
                  <div className="mt-2 text-sm text-red-500">
                    You have exceeded the maximum number of allowed video files. Please remove some files to continue.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Upload Summary</h3>
              
              <div className="border rounded-lg divide-y">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {getProductIcon(selectedProductType)}
                    <span className="ml-2 font-medium">
                      {selectedProductType.charAt(0).toUpperCase() + selectedProductType.slice(1)}
                    </span>
                  </div>
                  <Badge variant={isOverLimit(selectedProductType) ? "destructive" : "default"}>
                    {getFileCount(selectedProductType)} Files
                  </Badge>
                </div>
                
                {selectedProductType === "photography" && (
                  <>
                    <div className="p-4 pl-8 flex justify-between">
                      <span>Bracketed Photos</span>
                      <span>{photoForm.bracketedPhotos.length} files</span>
                    </div>
                    <div className="p-4 pl-8 flex justify-between">
                      <span>Single Photos</span>
                      <span>{photoForm.singlePhotos.length} files</span>
                    </div>
                    <div className="p-4 pl-8 flex justify-between font-medium">
                      <span>Estimated Final Images</span>
                      <span>
                        {Math.ceil(photoForm.bracketedPhotos.length / 3) + photoForm.singlePhotos.length} images
                      </span>
                    </div>
                  </>
                )}
                
