
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, Filter, Grid, List, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer, Order } from "@/components/customers/mock-data";

interface CustomerOrdersProps {
  customer: Customer;
}

export function CustomerOrders({ customer }: CustomerOrdersProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const orders = customer.orders || [];
  
  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.propertyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'card' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('card')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="pl-10 w-40" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Property Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.propertyType}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            'bg-amber-100 text-amber-800'}`}>
                          {order.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span>${order.amount}</span>
                          <span className={`text-xs ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">[Property Image]</span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{order.orderNumber}</h4>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {order.status}
                      </div>
                    </div>
                    <p className="text-sm mb-1">{order.address}</p>
                    <p className="text-sm text-muted-foreground mb-3">{order.propertyType}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">${order.amount}</p>
                        <p className={`text-xs ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">No Orders Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
