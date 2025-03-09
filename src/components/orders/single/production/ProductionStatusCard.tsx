
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Order } from '@/types/order-types';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface ProductionStatusCardProps {
  order: Order;
}

export const ProductionStatusCard: React.FC<ProductionStatusCardProps> = ({ order }) => {
  // Mock production status for demonstration
  const productionStatus = {
    totalItems: 5,
    completedItems: 2,
    inProgressItems: 1,
    todoItems: 2,
    progressPercentage: 40
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Status</CardTitle>
        <CardDescription>Current status of production for this order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm font-medium">{productionStatus.progressPercentage}%</span>
            </div>
            <Progress value={productionStatus.progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-md">
              <CheckCircle2 className="h-5 w-5 mb-1 text-green-600" />
              <span className="text-xl font-bold">{productionStatus.completedItems}</span>
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-md">
              <Loader2 className="h-5 w-5 mb-1 text-blue-600 animate-spin" />
              <span className="text-xl font-bold">{productionStatus.inProgressItems}</span>
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-md">
              <Clock className="h-5 w-5 mb-1 text-yellow-600" />
              <span className="text-xl font-bold">{productionStatus.todoItems}</span>
              <span className="text-xs text-muted-foreground">To Do</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
