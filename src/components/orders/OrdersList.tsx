
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, User, Phone, Mail } from "lucide-react";
import { Order } from "@/types/order-types";
import { format } from 'date-fns';
import { OrderActions } from './actions/OrderActions';

interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrdersList({ orders, isLoading }: OrdersListProps) {
  const navigate = useNavigate();

  const handleOrderClick = (orderId: string | number) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="h-24 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="py-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
            <CardFooter className="h-12 bg-gray-100 rounded-b-lg"></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="col-span-full p-8 text-center">
        <CardHeader>
          <CardTitle>No Orders Found</CardTitle>
          <CardDescription>Try changing your filters or create a new order.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/calendar')}>Create New Order</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <Card 
          key={order.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleOrderClick(order.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{order.orderNumber || order.order_number || `Order #${order.id}`}</CardTitle>
              <OrderActions orderId={String(order.id)} orderNumber={order.orderNumber || order.order_number} />
            </div>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {order.propertyAddress || order.address || 'No address provided'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {order.scheduledDate ? format(new Date(order.scheduledDate), 'MMM d, yyyy') : 
                   order.scheduled_date ? format(new Date(order.scheduled_date), 'MMM d, yyyy') : 
                   'Not scheduled'}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {order.scheduledTime || order.scheduled_time || 'N/A'}
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span>{order.client || order.customerName || 'No client'}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className={
                  order.status === 'completed' ? 'bg-green-50 text-green-800 border-green-200' :
                  order.status === 'scheduled' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                  order.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-200' :
                  'bg-yellow-50 text-yellow-800 border-yellow-200'
                }>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                
                {order.propertyType && (
                  <Badge variant="outline">
                    {order.propertyType || order.property_type}
                  </Badge>
                )}
                
                {(order.squareFeet || order.square_feet) && (
                  <Badge variant="outline">
                    {order.squareFeet || order.square_feet} sq ft
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3 flex justify-between">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>
                  {order.photographer ? order.photographer.charAt(0).toUpperCase() : 'P'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{order.photographer || 'Unassigned'}</span>
            </div>
            <div className="text-sm font-medium">
              ${order.price || order.amount || 0}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
