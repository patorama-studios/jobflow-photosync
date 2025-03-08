
import { useState, useEffect, useCallback, useRef } from "react";
import { addDays, addWeeks, subDays, subWeeks, addMonths, subMonths } from "date-fns";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { toast } from "sonner";

export interface Photographer {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

export function useCalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [photographers, setPhotographers] = useState<Photographer[]>([
    { id: "1", name: "David Thompson", color: "#3b82f6", selected: true },
    { id: "2", name: "Emma Richardson", color: "#ef4444", selected: true },
    { id: "3", name: "Michael Clem", color: "#10b981", selected: true },
    { id: "4", name: "Sophia Martinez", color: "#f59e0b", selected: true }
  ]);
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { updateSettings } = useHeaderSettings();
  
  useEffect(() => {
    updateSettings({
      title: "Calendar",
      description: "Manage your shooting schedule and appointments"
    });
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [updateSettings]);

  const handleViewChange = (value: string) => {
    setView(value as "month" | "week" | "day" | "agenda");
  };

  const handleOpenDialog = (time?: string) => {
    setTimeSlot(time || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeSlot(null);
  };

  const navigatePrevious = () => {
    if (view === "day") {
      setSelectedDate(prev => subDays(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => subWeeks(prev, 1));
    } else if (view === "month") {
      setSelectedDate(prev => subMonths(prev, 1));
    }
  };

  const navigateNext = () => {
    if (view === "day") {
      setSelectedDate(prev => addDays(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => addWeeks(prev, 1));
    } else if (view === "month") {
      setSelectedDate(prev => addMonths(prev, 1));
    }
  };

  const togglePhotographer = (id: string) => {
    setPhotographers(prev => 
      prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    );
  };

  const handleCalendarClick = useCallback((e: React.MouseEvent) => {
    // Only handle clicks directly on the calendar container
    if (e.target === calendarRef.current || calendarRef.current?.contains(e.target as Node)) {
      if ((e.target as HTMLElement).closest('button')) {
        // Ignore if clicking a button
        return;
      }
      
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const roundedMinutes = Math.floor(minutes / 15) * 15;
      
      const formattedTime = `${hours}:${roundedMinutes === 0 ? '00' : roundedMinutes}`;
      handleOpenDialog(formattedTime);
    }
  }, []);

  const handleRefreshCalendar = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Calendar refreshed");
    }, 800);
  };

  return {
    isLoading,
    view,
    isDialogOpen,
    selectedDate,
    timeSlot,
    photographers,
    timezone,
    calendarRef,
    setSelectedDate,
    setTimezone,
    handleViewChange,
    handleOpenDialog,
    handleCloseDialog,
    navigatePrevious,
    navigateNext,
    togglePhotographer,
    handleCalendarClick,
    handleRefreshCalendar,
    setIsDialogOpen
  };
}
