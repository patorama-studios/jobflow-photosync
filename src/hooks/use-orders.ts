
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderFilters } from "@/types/orders";
import { useToast } from "@/hooks/use-toast";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        
        // Fetch orders from Supabase
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('scheduled_date', { ascending: sortDirection === 'asc' });
        
        if (ordersError) throw ordersError;

        // Fetch additional appointments for all orders
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('additional_appointments')
          .select('*');
          
        if (appointmentsError) throw appointmentsError;

        // Fetch custom fields for all orders
        const { data: customFieldsData, error: customFieldsError } = await supabase
          .from('custom_fields')
          .select('*');
          
        if (customFieldsError) throw customFieldsError;

        // Map and combine the data
        const enhancedOrders = ordersData.map((order) => {
          // Find additional appointments for this order
          const orderAppointments = appointmentsData?.filter(
            (app) => app.order_id === order.id
          ) || [];
          
          // Find custom fields for this order
          const orderFields = customFieldsData?.filter(
            (field) => field.order_id === order.id
          ) || [];
          
          // Convert custom fields array to object format
          const customFieldsObject: Record<string, string> = {};
          orderFields.forEach((field) => {
            customFieldsObject[field.field_key] = field.field_value;
          });

          // Return enhanced order with additional data, mapping snake_case to camelCase
          return {
            id: order.id,
            orderNumber: order.order_number,
            address: order.address,
            city: order.city,
            state: order.state,
            zip: order.zip,
            client: order.client,
            clientEmail: order.client_email,
            clientPhone: order.client_phone,
            photographer: order.photographer,
            photographerPayoutRate: order.photographer_payout_rate,
            price: order.price,
            propertyType: order.property_type,
            scheduledDate: order.scheduled_date,
            scheduledTime: order.scheduled_time,
            squareFeet: order.square_feet,
            status: order.status,
            additionalAppointments: orderAppointments.map(app => ({
              id: app.id,
              date: app.date,
              time: app.time,
              description: app.description
            })),
            customFields: customFieldsObject,
            customerNotes: order.customer_notes,
            internalNotes: order.internal_notes,
            package: order.package
          } as Order;
        });

        setOrders(enhancedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error fetching orders",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [toast, sortDirection]);

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setDateRange({});
    setSortDirection("desc");
  };

  const filters: OrderFilters = {
    query,
    setQuery,
    status,
    setStatus,
    dateRange,
    setDateRange,
    sortDirection,
    setSortDirection,
    resetFilters,
  };

  return {
    orders,
    isLoading,
    filters,
  };
}
