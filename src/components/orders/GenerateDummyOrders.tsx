
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateDummyOrders } from '@/utils/generate-dummy-orders';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function GenerateDummyOrders() {
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast: uiToast } = useToast();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const orders = await generateDummyOrders(count);
      
      // Use sonner toast for success
      toast.success(`Successfully created ${orders.length} dummy orders.`);
      
      // Reload the page to show the new orders
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to generate orders:', error);
      
      // Get more detailed error message if available
      let errorMessage = 'Failed to generate dummy orders.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // @ts-ignore - might be from Supabase error
        errorMessage = error.message || errorMessage;
        // @ts-ignore - might have details from Supabase
        if (error.details) {
          // @ts-ignore
          errorMessage += ` Details: ${error.details}`;
        }
      }
      
      // Use sonner toast for error
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-muted/40 mb-6">
      <h3 className="text-lg font-medium mb-2">Generate Test Orders</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create dummy orders for testing purposes. This will add random orders to your database.
      </p>
      
      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="order-count">Number of Orders</Label>
          <Input 
            id="order-count" 
            type="number" 
            min={1} 
            max={100} 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
            className="w-32"
          />
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate Orders
        </Button>
      </div>
    </div>
  );
}
