
import React, { useMemo } from 'react';
import { ContractorSummaryProps } from './types';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, DollarSign, Award, Badge as BadgeIcon } from 'lucide-react';

export const ContractorSummary: React.FC<ContractorSummaryProps> = ({ contractors }) => {
  // Calculate total payouts
  const calculateTotalPayouts = () => {
    return contractors.reduce((sum, contractor) => sum + (contractor.payoutAmount || 0), 0);
  };

  // Calculate statistics by role
  const roleStats = useMemo(() => {
    const stats = new Map<string, { count: number; totalPayout: number; }>();
    
    contractors.forEach(contractor => {
      const role = contractor.role || 'unknown';
      const currentStats = stats.get(role) || { count: 0, totalPayout: 0 };
      
      stats.set(role, {
        count: currentStats.count + 1,
        totalPayout: currentStats.totalPayout + (contractor.payoutAmount || 0),
      });
    });
    
    return Array.from(stats.entries()).map(([role, data]) => ({
      role,
      count: data.count,
      totalPayout: data.totalPayout,
      percentage: (data.totalPayout / calculateTotalPayouts()) * 100,
    }));
  }, [contractors]);

  // Prepare data for pie chart
  const chartData = useMemo(() => {
    return roleStats.map(stat => ({
      name: stat.role.charAt(0).toUpperCase() + stat.role.slice(1),
      value: stat.totalPayout,
    }));
  }, [roleStats]);

  // Colors for the pie chart segments
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  const formatRoleName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
  };

  const totalPayout = calculateTotalPayouts();

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-lg">Contractor Summary</h3>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-muted-foreground">Total Payout</h3>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <p className="text-xl font-semibold text-green-600">
              ${totalPayout.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-1 mb-4">
          Across {contractors.length} contractor{contractors.length !== 1 ? 's' : ''}
        </div>
        
        <Separator className="my-3" />
        
        {/* Role Distribution */}
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <BadgeIcon className="h-4 w-4" />
            Role Distribution
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {roleStats.map(stat => (
              <Badge key={stat.role} variant="secondary" className="flex items-center gap-1">
                {formatRoleName(stat.role)} ({stat.count})
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Pie Chart Visualization */}
        {contractors.length > 0 && (
          <div className="mt-4 h-[200px]">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Award className="h-4 w-4" />
              Payout Distribution
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Role Breakdown */}
        {roleStats.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Role Breakdown</h4>
            <div className="space-y-2">
              {roleStats.map(stat => (
                <div key={stat.role} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[roleStats.findIndex(s => s.role === stat.role) % COLORS.length] }}
                    />
                    <span className="text-sm">{formatRoleName(stat.role)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">${stat.totalPayout.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
