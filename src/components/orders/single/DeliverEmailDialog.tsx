
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Order } from '@/types/order-types';
import { toast } from 'sonner';

interface DeliverEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export const DeliverEmailDialog: React.FC<DeliverEmailDialogProps> = ({
  isOpen,
  onOpenChange,
  order
}) => {
  const [emailData, setEmailData] = useState({
    to: order.clientEmail || order.client_email || '',
    subject: `Your property photos for ${order.propertyAddress || order.address || 'your order'} are ready!`,
    message: `Hello ${order.client || order.customerName || 'there'},\n\nYour property photos are now ready for viewing and download. Please use the links below to access your content.\n\nThank you for choosing our services.\n\nBest regards,\nThe Team`,
    includeDownloadLink: true,
    includePropertyWebsite: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setEmailData({
      ...emailData,
      [field]: checked
    });
  };

  const handleSendEmail = () => {
    // Implementation for sending the delivery email would go here
    toast.success("Delivery email sent successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Delivery Email</DialogTitle>
          <DialogDescription>
            Send a delivery email to the client with access to their content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="to">Recipient</Label>
            <Input
              id="to"
              name="to"
              value={emailData.to}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              value={emailData.message}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeDownloadLink" 
                checked={emailData.includeDownloadLink}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('includeDownloadLink', checked as boolean)
                }
              />
              <Label htmlFor="includeDownloadLink">Include download page link</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includePropertyWebsite" 
                checked={emailData.includePropertyWebsite}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('includePropertyWebsite', checked as boolean)
                }
              />
              <Label htmlFor="includePropertyWebsite">Include property website link</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail}>
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
