
import React, { useState, useEffect } from 'react';
import { ExternalLink, FolderOpen, RefreshCw, Lock, Copy, Check, Key } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BoxIntegration, createBoxIntegration, ProductType } from '@/lib/box-integration';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface BoxFolderIntegrationProps {
  orderNumber: string;
  propertyAddress: string;
  productType?: string;
  onFolderCreated?: (folderId: string) => void;
}

export function BoxFolderIntegration({
  orderNumber,
  propertyAddress,
  productType,
  onFolderCreated
}: BoxFolderIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [masterFolderId, setMasterFolderId] = useState('');
  const [orderFolderId, setOrderFolderId] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | ''>('');
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [authTab, setAuthTab] = useState('token');
  
  const { toast } = useToast();
  
  // Box integration instance
  const [boxIntegration, setBoxIntegration] = useState<BoxIntegration | null>(null);
  
  // Enable Box integration
  const handleConnectBox = () => {
    if (!masterFolderId) {
      toast({
        title: "Master Folder ID Required",
        description: "Please enter a master folder ID to connect with Box.",
        variant: "destructive",
      });
      return;
    }
    
    if (authTab === 'token' && !accessToken) {
      toast({
        title: "Access Token Required",
        description: "Please enter a Box access token to connect.",
        variant: "destructive",
      });
      return;
    }
    
    if (authTab === 'oauth' && (!clientId || !clientSecret)) {
      toast({
        title: "Client Credentials Required",
        description: "Please enter Box client ID and secret to connect.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create Box integration instance with provided credentials
      const credentials = authTab === 'token' 
        ? { accessToken } 
        : { clientId, clientSecret };
        
      const newBoxIntegration = createBoxIntegration(credentials);
      
      // Set the master folder
      newBoxIntegration.setMasterFolder(masterFolderId);
      
      // Initialize the auto folder
      newBoxIntegration.initializeAutoFolder()
        .then(autoFolderId => {
          if (autoFolderId) {
            setBoxIntegration(newBoxIntegration);
            setIsConnected(true);
            toast({
              title: "Box Connected",
              description: "Successfully connected to Box and initialized auto folder.",
            });
          } else {
            toast({
              title: "Connection Failed",
              description: "Unable to initialize auto folder in Box.",
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error('Box connection error:', error);
          toast({
            title: "Connection Error",
            description: "Failed to connect to Box API. Please check your credentials.",
            variant: "destructive",
          });
        });
    } catch (error) {
      console.error('Box connection setup error:', error);
      toast({
        title: "Setup Error",
        description: "An error occurred while setting up Box connection.",
        variant: "destructive",
      });
    }
  };
  
  // Create order folder and subfolders
  const handleCreateOrderFolder = () => {
    if (!isConnected || !boxIntegration) {
      toast({
        title: "Not Connected",
        description: "Please connect to Box first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingFolders(true);
    
    // Create the order folder with name: [Order Number] - Property Address
    boxIntegration.createOrderFolder(orderNumber, propertyAddress)
      .then(folder => {
        setIsCreatingFolders(false);
        
        if (folder) {
          setOrderFolderId(folder.id);
          setFolderPath(folder.path || null);
          
          toast({
            title: "Folders Created",
            description: `Successfully created folder structure for order #${orderNumber}.`,
          });
          
          // Notify parent component
          if (onFolderCreated) {
            onFolderCreated(folder.id);
          }
        } else {
          toast({
            title: "Folder Creation Failed",
            description: "Unable to create folder structure in Box.",
            variant: "destructive",
          });
        }
      })
      .catch(error => {
        setIsCreatingFolders(false);
        console.error('Box folder creation error:', error);
        toast({
          title: "Folder Creation Error",
          description: "An error occurred while creating folders in Box.",
          variant: "destructive",
        });
      });
  };
  
  // Copy folder link to clipboard
  const handleCopyLink = () => {
    if (!orderFolderId) return;
    
    // Copy the Box folder URL to clipboard
    const boxFolderUrl = `https://app.box.com/folder/${orderFolderId}`;
    navigator.clipboard.writeText(boxFolderUrl)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        
        toast({
          title: "Link Copied",
          description: "Box folder link copied to clipboard.",
        });
      })
      .catch(error => {
        console.error('Copy error:', error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        });
      });
  };
  
  // Open folder in Box
  const handleOpenFolder = () => {
    if (!orderFolderId) return;
    
    // Open the Box folder in a new tab
    window.open(`https://app.box.com/folder/${orderFolderId}`, '_blank');
  };
  
  // Get specific product type folder
  const handleGetProductTypeFolder = () => {
    if (!orderFolderId || !selectedProductType || !boxIntegration) {
      toast({
        title: "Selection Required",
        description: "Please select a product type.",
        variant: "destructive",
      });
      return;
    }
    
    // Get the product type folder (defaulting to raw input)
    boxIntegration.getProductTypeFolder(orderFolderId, selectedProductType as ProductType, true)
      .then(folderId => {
        if (folderId) {
          // Open the product type folder in a new tab
          window.open(`https://app.box.com/folder/${folderId}`, '_blank');
        } else {
          toast({
            title: "Folder Not Found",
            description: `Unable to find folder for ${selectedProductType}.`,
            variant: "destructive",
          });
        }
      })
      .catch(error => {
        console.error('Get product folder error:', error);
        toast({
          title: "Error",
          description: "An error occurred while accessing the folder.",
          variant: "destructive",
        });
      });
  };
  
  // Set initial product type based on props
  useEffect(() => {
    if (productType) {
      switch (productType.toLowerCase()) {
        case 'photo':
        case 'photography':
          setSelectedProductType('Photography');
          break;
        case 'video':
          setSelectedProductType('Video');
          break;
        case 'drone':
          setSelectedProductType('Drone');
          break;
        case 'floorplan':
        case 'floor plan':
        case 'floor plans':
          setSelectedProductType('Floor Plans');
          break;
        case 'print':
        case 'print material':
          setSelectedProductType('Print Material');
          break;
        default:
          setSelectedProductType('');
      }
    }
  }, [productType]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Box Integration</CardTitle>
        <CardDescription>
          Create and manage folders in Box for this order
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <Tabs defaultValue="token" value={authTab} onValueChange={setAuthTab}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="token" className="flex-1">Access Token</TabsTrigger>
                <TabsTrigger value="oauth" className="flex-1">OAuth Client</TabsTrigger>
              </TabsList>
              
              <TabsContent value="token" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-token">Box Access Token</Label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="Enter your Box developer token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can generate a developer token in your Box Developer Console
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="oauth" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input
                    id="client-id"
                    placeholder="Enter your Box client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-secret">Client Secret</Label>
                  <Input
                    id="client-secret"
                    type="password"
                    placeholder="Enter your Box client secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                </div>
                
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Key className="h-3.5 w-3.5" />
                  OAuth flow is not fully implemented yet. Use access token instead.
                </p>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
              <Label htmlFor="master-folder">Master Folder ID</Label>
              <Input
                id="master-folder"
                placeholder="Enter Box master folder ID"
                value={masterFolderId}
                onChange={(e) => setMasterFolderId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This is the parent folder where all order folders will be created
              </p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleConnectBox}
              disabled={!masterFolderId || (authTab === 'token' && !accessToken) || (authTab === 'oauth' && (!clientId || !clientSecret))}
            >
              Connect to Box
            </Button>
            
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">How to get started with Box:</p>
              <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
                <li>Create a <a href="https://developer.box.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Box Developer account</a></li>
                <li>Create a new application or use an existing one</li>
                <li>Generate a developer token for quick testing</li>
                <li>Find your folder ID by navigating to it in Box and checking the URL</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="rounded-md bg-primary/10 p-4">
                <h3 className="font-medium mb-1">Order Information</h3>
                <p className="text-sm text-muted-foreground mb-2">Folder will be created with this name:</p>
                <div className="text-sm font-mono bg-background p-2 rounded border">
                  [{orderNumber}] - {propertyAddress}
                </div>
              </div>
              
              {!orderFolderId ? (
                <Button 
                  className="w-full" 
                  onClick={handleCreateOrderFolder}
                  disabled={isCreatingFolders}
                >
                  {isCreatingFolders ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating Folders...
                    </>
                  ) : (
                    <>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Create Folder Structure
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Folders successfully created</span>
                  </div>
                  
                  {folderPath && (
                    <div className="space-y-2">
                      <Label>Folder Path</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-muted p-2 rounded text-sm font-mono truncate">
                          {folderPath}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopyLink}>
                          {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-type">Access Product Folder</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={selectedProductType} 
                        onValueChange={(value) => setSelectedProductType(value as ProductType)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Photography">Photography</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Drone">Drone</SelectItem>
                          <SelectItem value="Floor Plans">Floor Plans</SelectItem>
                          <SelectItem value="Print Material">Print Material</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        onClick={handleGetProductTypeFolder}
                        disabled={!selectedProductType}
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handleOpenFolder}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Main Order Folder
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        {isConnected && (
          <p className="text-xs text-muted-foreground mt-2">
            This creates a folder structure with Raw Input and Completed subfolders for each product type
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
