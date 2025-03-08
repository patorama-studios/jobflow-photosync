
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MediaGalleryCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted/40 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Media gallery will be implemented here</p>
        </div>
      </CardContent>
    </Card>
  );
};
