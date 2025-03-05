import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Order } from '@/hooks/useSampleOrders';
import { useToast } from '@/components/ui/use-toast';

interface OrderExportProps {
  orders: Order[];
  allOrders: Order[];
  isFiltered: boolean;
}

export const OrderExport: React.FC<OrderExportProps> = ({ 
  orders, 
  allOrders,
  isFiltered 
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'csv' | 'excel' | 'pdf', exportAll: boolean) => {
    setIsExporting(true);
    
    try {
      const dataToExport = exportAll ? allOrders : orders;
      
      // Process orders data into appropriate format
      // In a real app, this would call an API or use a library
      const processedData = processOrderData(dataToExport);
      
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Notify user of successful export
      toast({
        title: "Export successful",
        description: `${dataToExport.length} orders exported as ${format.toUpperCase()}`,
      });
      
      // In a real implementation, this would trigger a file download
      console.log(`Exporting ${dataToExport.length} orders as ${format}`);
      console.log(processedData);
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Process order data for export
  const processOrderData = (orders: Order[]) => {
    // In a real app, this would format the data according to the export type
    return orders.map(order => ({
      orderNumber: order.orderNumber,
      client: order.client,
      address: order.address,
      date: order.scheduledDate,
      status: order.status,
      price: order.price
    }));
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isExporting || orders.length === 0}
        >
          <Download className="h-4 w-4" />
          Export
          {isExporting && <span className="ml-2 animate-spin">...</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleExport('csv', false)}
          disabled={orders.length === 0}
          className="flex items-center cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('excel', false)}
          disabled={orders.length === 0}
          className="flex items-center cursor-pointer"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('pdf', false)}
          disabled={orders.length === 0}
          className="flex items-center cursor-pointer"
        >
          <File className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        
        {isFiltered && (
          <>
            <DropdownMenuItem className="text-xs text-muted-foreground py-1" disabled>
              Export Options
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleExport('csv', true)}
              className="flex items-center cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Export All Orders</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
