
import React, { useMemo } from 'react';
import { Contractor } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, Briefcase, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ContractorSummaryProps {
  contractors: Contractor[];
}

export const ContractorSummary: React.FC<ContractorSummaryProps> = ({ contractors }) => {
  // Calculate total payout amount
  const totalPayouts = useMemo(() => 
    contractors.reduce((acc, contractor) => 
      acc + (contractor.payoutAmount || 0), 0
    ), [contractors]
  );
  
  // Calculate statistics by role
  const roleStats = useMemo(() => {
    const stats: Record<string, { count: number, amount: number }> = {};
    
    contractors.forEach(contractor => {
      const role = contractor.role || 'other';
      const amount = contractor.payoutAmount || 0;
      
      if (!stats[role]) {
        stats[role] = { count: 0, amount: 0 };
      }
      
      stats[role].count += 1;
      stats[role].amount += amount;
    });
    
    return stats;
  }, [contractors]);
  
  // Prepare data for the pie chart
  const chartData = useMemo(() => 
    Object.entries(roleStats).map(([role, data]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: data.amount,
      percentage: totalPayouts > 0 ? Math.round((data.amount / totalPayouts) * 100) : 0
    })),
    [roleStats, totalPayouts]
  );
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            Contractor Summary
          </h3>
          <h4 className="text-lg font-medium flex items-center">
            <DollarSign className="mr-1 h-5 w-5 text-green-500" />
            Total: ${totalPayouts.toFixed(2)}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Role breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              Role Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(roleStats).map(([role, data]) => (
                <div key={role} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {data.count}
                    </Badge>
                    <span className="capitalize">{role}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${data.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {totalPayouts > 0 ? Math.round((data.amount / totalPayouts) * 100) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right columns: Visualization */}
          <div className="md:col-span-2 h-[250px]">
            {contractors.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No contractor data available for visualization
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
