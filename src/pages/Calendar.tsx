
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useCalendarPage } from "@/hooks/use-calendar-page";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { MonthCalendar } from "@/components/calendar/views/MonthCalendar";

export function CalendarPage() {
  const {
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
  } = useCalendarPage();

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <CalendarHeader 
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleOpenDialog={handleOpenDialog}
          handleCloseDialog={handleCloseDialog}
          selectedDate={selectedDate}
          timeSlot={timeSlot}
          handleRefreshCalendar={handleRefreshCalendar}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <CalendarSidebar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timezone={timezone}
            setTimezone={setTimezone}
            photographers={photographers}
            togglePhotographer={togglePhotographer}
          />
          
          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <CalendarToolbar 
              view={view}
              selectedDate={selectedDate}
              handleViewChange={handleViewChange}
              navigatePrevious={navigatePrevious}
              navigateNext={navigateNext}
            />
            
            <div className="flex-1 overflow-auto p-2 md:p-4" ref={calendarRef} onClick={handleCalendarClick}>
              {view === "month" && <MonthCalendar isLoading={isLoading} />}
              
              {/* We would implement other views (week, day, agenda) as needed */}
              {view !== "month" && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">{view.charAt(0).toUpperCase() + view.slice(1)} view coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Adding default export for lazy loading
export default CalendarPage;
