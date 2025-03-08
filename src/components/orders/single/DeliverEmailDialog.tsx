
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, PlusCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';

interface DeliverEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export function DeliverEmailDialog({ isOpen, onOpenChange, order }: DeliverEmailDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({
    to: order.clientEmail || order.client_email || '',
    subject: `Your order #${order.orderNumber || order.order_number} is ready - Patorama Studios`,
    message: `
Dear ${order.client},

Your order #${order.orderNumber || order.order_number} for ${order.address} is now ready for download.

You can access your content through the following link:
${window.location.origin}/delivery/${order.id}

The content will be available for download for the next 30 days.

If you have any questions or need any assistance, please don't hesitate to contact us.

Best regards,
Patorama Studios Team
    `.trim()
  });
  
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');

  const handleAddEmail = () => {
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setAdditionalEmails([...additionalEmails, newEmail]);
      setNewEmail('');
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = [...additionalEmails];
    updatedEmails.splice(index, 1);
    setAdditionalEmails(updatedEmails);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSendEmail = async () => {
    setIsSending(true);

    try {
      // Prepare all recipient emails
      const allRecipients = [emailData.to, ...additionalEmails].filter(Boolean);
      
      // Create email delivery data
      const emailPayload = {
        to: allRecipients.join(', '),
        subject: emailData.subject,
        html: emailData.message.replace(/\n/g, '<br>'),
        from: 'Patorama Studios <no-reply@patoramastudios.com>'
      };

      // Send the email using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailPayload
      });

      if (error) throw error;

      // Log the activity in order_activities
      await supabase.from('order_activities').insert({
        order_id: order.id,
        activity_type: 'email_delivery',
        description: `Delivery email sent to ${allRecipients.join(', ')}`,
        metadata: { emailData: emailPayload }
      });

      toast({
        title: "Email sent successfully",
        description: `Delivery notification sent to ${allRecipients.length} recipient(s).`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending the delivery notification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Delivery Notification</DialogTitle>
          <DialogDescription>
            Send an email notification to inform the client that their content is ready.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To
            </Label>
            <Input
              id="to"
              name="to"
              value={emailData.to}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          {additionalEmails.length > 0 && (
            <div className="ml-[33%] space-y-2">
              {additionalEmails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="additional" className="text-right">
              Add CC
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="additional"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter additional email"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleAddEmail}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={emailData.message}
              onChange={handleInputChange}
              rows={12}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending}>
            {isSending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
