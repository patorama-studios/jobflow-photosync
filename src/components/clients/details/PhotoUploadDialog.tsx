
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useClientPhoto } from "@/hooks/use-client-photo";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onPhotoUpdated: (photoUrl: string) => void;
  currentPhotoUrl?: string;
}

export function PhotoUploadDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  onPhotoUpdated,
  currentPhotoUrl
}: PhotoUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { uploadClientPhoto, isUploading } = useClientPhoto(clientId);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    
    const photoUrl = await uploadClientPhoto(selectedFile);
    if (photoUrl) {
      onPhotoUpdated(photoUrl);
      reset();
      onOpenChange(false);
    }
  };
  
  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  
  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>
            Upload a new profile photo for {clientName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={previewUrl || currentPhotoUrl} alt={clientName} />
            <AvatarFallback className="text-2xl">{clientName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          {selectedFile ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={reset}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer border-muted-foreground/25 hover:border-muted-foreground/40"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
