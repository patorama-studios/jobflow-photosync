
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export function DownloadSettings() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Download settings updated",
      description: "Your download preferences have been saved.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Download Settings</h2>
        <p className="text-muted-foreground">
          Configure how images and files are processed and named when downloaded
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Image Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxDimension">Maximum Image Dimension (pixels)</Label>
              <Input id="maxDimension" type="number" defaultValue="2048" />
              <p className="text-sm text-muted-foreground">
                The maximum width or height an image can have
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="imageQuality">Image Quality</Label>
                <span className="text-sm text-muted-foreground">80%</span>
              </div>
              <Slider id="imageQuality" defaultValue={[80]} max={100} step={1} />
              <p className="text-sm text-muted-foreground">
                Higher quality means larger file size
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dpi">DPI Setting</Label>
              <Select defaultValue="72">
                <SelectTrigger id="dpi">
                  <SelectValue placeholder="Select DPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="72">72 DPI (Web)</SelectItem>
                  <SelectItem value="150">150 DPI (Medium Quality)</SelectItem>
                  <SelectItem value="300">300 DPI (Print Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">File Naming</h3>
          <div className="space-y-4">
            <RadioGroup defaultValue="original" className="space-y-4">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="original" id="naming-original" />
                <div className="grid gap-1">
                  <Label htmlFor="naming-original" className="font-normal">Use original file names from upload</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep the original file names as uploaded by photographers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="address-order" id="naming-address-order" />
                <div className="grid gap-1">
                  <Label htmlFor="naming-address-order" className="font-normal">Rename to address and order number</Label>
                  <p className="text-sm text-muted-foreground">
                    Example: 123_Main_St_SF_CA_94105_ORD123456_001.jpg
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="custom" id="naming-custom" />
                <div className="grid gap-1">
                  <Label htmlFor="naming-custom" className="font-normal">Custom naming format</Label>
                  <Input defaultValue="{address}_{order_number}_{index}" />
                  <p className="text-sm text-muted-foreground">
                    Available variables: {"{address}"}, {"{city}"}, {"{state}"}, {"{zip}"}, {"{order_number}"}, {"{index}"}, {"{date}"}, {"{customer_name}"}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Download Settings</Button>
      </div>
    </div>
  );
}
