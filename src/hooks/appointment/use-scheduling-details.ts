
import { useState } from 'react';
import { FormValues } from './use-appointment-form-state';

export interface CustomItem {
  id: string;
  name: string;
  price: number;
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
}

export const useSchedulingDetails = (initialDate: Date, initialTime?: string) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime || "09:00");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedNotification, setSelectedNotification] = useState("email");
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const handleDateChange = (date: Date) => {
    setSelectedDateTime(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleNotificationMethodChange = (method: string) => {
    setSelectedNotification(method);
  };

  const handleAddCustomItem = (item: CustomItem) => {
    setCustomItems([...customItems, item]);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(customItems.filter(item => item.id !== id));
  };

  const handleProductsChange = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
  };

  return {
    selectedDateTime,
    selectedTime,
    selectedDuration,
    selectedNotification,
    customItems,
    selectedProducts,
    handleDateChange,
    handleTimeChange,
    handleDurationChange,
    handleNotificationMethodChange,
    handleAddCustomItem,
    handleRemoveCustomItem,
    handleProductsChange
  };
};
