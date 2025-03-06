
import React from 'react';
import { Bold, Italic, Underline, Link2, AlignLeft, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

export const OrderNotesSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div>
      <p className="text-sm font-medium mb-2">Order Notes (private)</p>
      <div className="border rounded-md mb-2">
        <div className={`flex items-center border-b p-1 ${isMobile ? 'flex-wrap' : ''}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link2 className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1"></div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <Textarea className="border-0 focus-visible:ring-0" placeholder="Enter notes here..." />
      </div>
    </div>
  );
};
