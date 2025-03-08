
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog";
import { Plus, Calendar as CalendarIcon, RefreshCw } from "lucide-react";

interface CalendarHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  handleOpenDialog: (time?: string) => void;
  handleCloseDialog: () => void;
  selectedDate: Date;
  timeSlot: string | null;
  handleRefreshCalendar: () => void;
}

export function CalendarHeader({
  isDialogOpen,
  setIsDialogOpen,
  handleOpenDialog,
  handleCloseDialog,
  selectedDate,
  timeSlot,
  handleRefreshCalendar
}: CalendarHeaderProps) {
  return (
    <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-background">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-7 w-7 text-primary" />
          Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your shooting schedule and appointments
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={handleRefreshCalendar}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <CreateAppointmentDialog 
            isOpen={isDialogOpen} 
            onClose={handleCloseDialog} 
            selectedDate={selectedDate}
            initialTime={timeSlot || undefined}
          />
        </Dialog>
      </div>
    </div>
  );
}
