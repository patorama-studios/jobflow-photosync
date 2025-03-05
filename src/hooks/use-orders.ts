
import { useState } from "react";
import { useSampleOrders, Order } from "@/hooks/useSampleOrders";

export interface OrderFilters {
  query: string;
  setQuery: (query: string) => void;
  status: string;
  setStatus: (status: string) => void;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  setDateRange: (dateRange: { from?: Date; to?: Date }) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  resetFilters: () => void;
}

export function useOrders() {
  const { orders, isLoading } = useSampleOrders();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
