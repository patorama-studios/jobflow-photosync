
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";

interface MonthCalendarProps {
  isLoading: boolean;
}

export function MonthCalendar({ isLoading }: MonthCalendarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-2 h-full animate-pulse">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-md h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-card rounded-lg h-full overflow-hidden shadow-sm border">
      <CardContent className="p-0 h-full">
        <div className="grid grid-cols-7 border-b">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="font-medium text-center py-2 text-sm border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 h-[calc(100%-36px)]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={`border-r border-b p-1 min-h-[120px] ${i % 7 === 6 ? 'border-r-0' : ''}`}>
              <div className="text-sm font-medium mb-1">
                {1 + (i % 31)}
              </div>
              {/* Sample appointments that would be replaced with real data */}
              {i === 4 && (
                <div className="bg-blue-100 text-blue-800 rounded p-1 text-xs mb-1">
                  09:00 Webster Road
                </div>
              )}
              {i === 5 && (
                <div className="bg-red-100 text-red-800 rounded p-1 text-xs mb-1">
                  Unavailable
                </div>
              )}
              {i === 15 && (
                <div className="bg-green-100 text-green-800 rounded p-1 text-xs mb-1">
                  14:45 Queen Street
                </div>
              )}
              {i === 23 && (
                <div className="bg-amber-100 text-amber-800 rounded p-1 text-xs mb-1">
                  15:00 Rymera Crescent
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
