
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/types/order-types';
import { Image, FileText, Film } from 'lucide-react';

interface MediaGalleryCardProps {
  order: Order;
}

export const MediaGalleryCard: React.FC<MediaGalleryCardProps> = ({ order }) => {
  // Mock media items for demonstration
  const mediaItems = [
    { type: 'image', count: 24 },
    { type: 'document', count: 2 },
    { type: 'video', count: 1 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>Uploaded media for this order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
            <Image className="h-10 w-10 mb-2 text-blue-500" />
            <span className="text-2xl font-bold">{mediaItems[0].count}</span>
            <span className="text-sm text-muted-foreground">Photos</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
            <FileText className="h-10 w-10 mb-2 text-green-500" />
            <span className="text-2xl font-bold">{mediaItems[1].count}</span>
            <span className="text-sm text-muted-foreground">Documents</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
            <Film className="h-10 w-10 mb-2 text-purple-500" />
            <span className="text-2xl font-bold">{mediaItems[2].count}</span>
            <span className="text-sm text-muted-foreground">Videos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
