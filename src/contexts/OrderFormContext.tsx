
import React, { createContext, useContext, ReactNode } from 'react';
import { useOrderForm } from '@/hooks/use-order-form';

type OrderFormContextType = ReturnType<typeof useOrderForm>;

// Create the context with a default empty value
const OrderFormContext = createContext<OrderFormContextType | undefined>(undefined);

export const OrderFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const orderFormState = useOrderForm();
  
  return (
    <OrderFormContext.Provider value={orderFormState}>
      {children}
    </OrderFormContext.Provider>
  );
};

// Custom hook to use the context
export const useOrderFormContext = () => {
  const context = useContext(OrderFormContext);
  if (context === undefined) {
    throw new Error('useOrderFormContext must be used within an OrderFormProvider');
  }
  return context;
};
