
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { Photographer } from './types';

export const useSidebarState = (showCalendarSubmenu = false) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(!showCalendarSubmenu);
  const location = useLocation();
  const { orders } = useSampleOrders();

  // Create array of photographer objects from orders
  const photographers: Photographer[] = Array.from(
    new Set(orders.map(order => order.photographer))
  ).map((name, index) => {
    return { 
      id: index + 1, 
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}` // Random color
    };
  });

  // Get selected photographers from localStorage or use all by default
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>(() => {
    const saved = localStorage.getItem('selectedPhotographers');
    return saved ? JSON.parse(saved) : photographers.map(p => p.id);
  });

  // Update selected photographers if photographers list changes
  useEffect(() => {
    const saved = localStorage.getItem('selectedPhotographers');
    if (!saved) {
      setSelectedPhotographers(photographers.map(p => p.id));
    }
  }, [photographers]);

  const toggleSidebar = useCallback(() => 
    setCollapsed(prev => !prev),
  []);
  
  const toggleMobileSidebar = useCallback(() => 
    setMobileOpen(prev => !prev),
  []);

  const toggleMainMenu = useCallback(() => 
    setShowMainMenu(prev => !prev),
  []);

  const togglePhotographer = useCallback((id: number) => {
    setSelectedPhotographers(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('selectedPhotographers', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Helper function to determine if a link is active
  const isActiveLink = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  // Update showMainMenu when showCalendarSubmenu changes
  useEffect(() => {
    setShowMainMenu(!showCalendarSubmenu);
  }, [showCalendarSubmenu]);

  // Push content to the edge when in calendar submenu mode
  useEffect(() => {
    if (showCalendarSubmenu) {
      setCollapsed(false);
    }
  }, [showCalendarSubmenu]);

  return {
    collapsed,
    mobileOpen,
    showMainMenu,
    photographers,
    selectedPhotographers,
    toggleSidebar,
    toggleMobileSidebar,
    toggleMainMenu,
    togglePhotographer,
    isActiveLink
  };
};
