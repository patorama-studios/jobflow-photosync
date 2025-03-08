
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, Download, Globe, Share, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Order } from '@/types/order-types';

interface OrderActionButtonsProps {
  order: Order;
  onDeliverClick: () => void;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({ 
  order, 
  onDeliverClick 
}) => {
  const navigate = useNavigate();
  
  // Convert order.id to string if it's a number
  const orderId = typeof order.id === 'number' ? order.id.toString() : order.id;
  
  // Handle navigation to production upload
  const handleStartUpload = () => {
    navigate(`/production/upload/${orderId}`);
  };
  
  // Handle navigation to property website
  const handlePropertyWebsite = () => {
    navigate(`/property/${orderId}`);
  };
  
  // Handle downloads page navigation
  const handleDownloads = () => {
    navigate(`/downloads?orderId=${orderId}`);
  };
  
  // Handle sharing functionality
  const handleShare = () => {
    // Create a share link to downloads page
    const shareLink = `${window.location.origin}/downloads?orderId=${orderId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "The share link has been copied to your clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast({
          title: "Failed to copy link",
          description: "Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <Button 
        variant="default" 
        className="bg-blue-500 hover:bg-blue-600"
        onClick={handleStartUpload}
      >
        <Upload className="h-4 w-4 mr-2" />
        Start Upload
      </Button>
      <Button 
        variant="outline"
        onClick={handleDownloads}
      >
        <Download className="h-4 w-4 mr-2" />
        Downloads
      </Button>
      <Button 
        variant="outline"
        onClick={handlePropertyWebsite}
      >
        <Globe className="h-4 w-4 mr-2" />
        Property Website
      </Button>
      <Button 
        variant="outline"
        onClick={handleShare}
      >
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button 
        variant="outline"
        onClick={onDeliverClick}
      >
        <Send className="h-4 w-4 mr-2" />
        Deliver
      </Button>
    </div>
  );
};
