
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bold, Italic, List, ListOrdered, AlignLeft, 
  AlignCenter, AlignRight, Link, FileText, ExternalLink
} from "lucide-react";

export function LegalSettings() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Legal settings updated",
      description: "Your legal documents have been saved.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Legal Settings</h2>
        <p className="text-muted-foreground">
          Manage your legal documents and policies
        </p>
      </div>
      
      <Tabs defaultValue="terms">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="copyright">Copyright</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Terms of Service</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Import PDF
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Link External
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="termsUrl">URL to Terms Document (optional)</Label>
              <Input id="termsUrl" placeholder="https://example.com/terms" />
            </div>
            
            <div className="space-y-2">
              <Label>Editor</Label>
              <div className="border rounded-md p-1">
                <div className="flex flex-wrap gap-1 border-b p-1">
                  <Toggle aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle bullet list">
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle numbered list">
                    <ListOrdered className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Left align">
                    <AlignLeft className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Center align">
                    <AlignCenter className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Right align">
                    <AlignRight className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Insert link">
                    <Link className="h-4 w-4" />
                  </Toggle>
                </div>
                <Textarea 
                  className="border-0 focus-visible:ring-0 min-h-[300px]" 
                  placeholder="Write your terms of service here..."
                  defaultValue={`1. ACCEPTANCE OF TERMS\n\nBy accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.`}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="privacy" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Privacy Policy</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Import PDF
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Link External
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="privacyUrl">URL to Privacy Document (optional)</Label>
              <Input id="privacyUrl" placeholder="https://example.com/privacy" />
            </div>
            
            <div className="space-y-2">
              <Label>Editor</Label>
              <div className="border rounded-md p-1">
                <div className="flex flex-wrap gap-1 border-b p-1">
                  {/* Same editor tools */}
                  <Toggle aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle bullet list">
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle numbered list">
                    <ListOrdered className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Left align">
                    <AlignLeft className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Center align">
                    <AlignCenter className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Right align">
                    <AlignRight className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Insert link">
                    <Link className="h-4 w-4" />
                  </Toggle>
                </div>
                <Textarea 
                  className="border-0 focus-visible:ring-0 min-h-[300px]" 
                  placeholder="Write your privacy policy here..."
                  defaultValue={`PRIVACY POLICY\n\nThis Privacy Policy describes how we collect, use, and disclose your personal information when you use our services.`}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="copyright" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Copyright Policy</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Import PDF
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Link External
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="copyrightUrl">URL to Copyright Document (optional)</Label>
              <Input id="copyrightUrl" placeholder="https://example.com/copyright" />
            </div>
            
            <div className="space-y-2">
              <Label>Editor</Label>
              <div className="border rounded-md p-1">
                <div className="flex flex-wrap gap-1 border-b p-1">
                  {/* Same editor tools */}
                  <Toggle aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle bullet list">
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle numbered list">
                    <ListOrdered className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Left align">
                    <AlignLeft className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Center align">
                    <AlignCenter className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Right align">
                    <AlignRight className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Insert link">
                    <Link className="h-4 w-4" />
                  </Toggle>
                </div>
                <Textarea 
                  className="border-0 focus-visible:ring-0 min-h-[300px]" 
                  placeholder="Write your copyright policy here..."
                  defaultValue={`COPYRIGHT POLICY\n\nAll content included on this site, such as text, graphics, logos, images, is the property of our company or its content suppliers and protected by copyright laws.`}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="additional" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Additional Policies</h3>
              <Button variant="outline" size="sm">
                Add New Policy
              </Button>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/50 text-center">
              <p className="text-muted-foreground">No additional policies have been created yet.</p>
              <Button variant="outline" className="mt-2">
                Create New Policy
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Legal Settings</Button>
      </div>
    </div>
  );
}
