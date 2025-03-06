import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, DollarSign, Edit, File, Folder, Image, MessageSquare, Phone, RefreshCw, Trash2, User, XCircle } from 'lucide-react';
import { Order, OrderStatus, Contractor, RefundRecord } from '@/types/orders';
import { useOrders } from '@/hooks/use-orders';
import { useContractors } from '@/hooks/use-contractors';
import { useRefunds } from '@/hooks/use-refunds';
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from '@/lib/utils';
import { generateRandomId } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "editing", label: "Editing" },
  { value: "review", label: "Review" },
  { value: "delivered", label: "Delivered" },
];

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, isLoading, error, updateFilters } = useOrders();
  const { contractors, isLoading: isContractorsLoading, error: contractorsError } = useContractors();
  const { refunds, isLoading: isRefundsLoading, error: refundsError } = useRefunds();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContractorDialogOpen, setIsContractorDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isAddRefundDialogOpen, setIsAddRefundDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [newContractor, setNewContractor] = useState<Contractor>({
    id: '',
    name: '',
    role: '',
    payoutRate: 0,
    payoutAmount: 0,
    notes: '',
  });
  const [refundsForOrder, setRefundsForOrder] = useState<RefundRecord[]>([]);
  const [newRefund, setNewRefund] = useState<Omit<RefundRecord, 'id' | 'status' | 'stripeRefundId'>>({
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
    isFullRefund: false,
  });
  const [isFullRefund, setIsFullRefund] = useState(false);

  useEffect(() => {
    if (id && orders) {
      const foundOrder = orders.find((order) => order.id === id);
      setOrder(foundOrder || null);
      setEditedOrder(foundOrder ? { ...foundOrder } : null);
    }
  }, [id, orders]);

  useEffect(() => {
    if (order && refunds) {
      const orderRefunds = refunds.filter(refund => refund.orderId === order.id);
      setRefundsForOrder(orderRefunds);
    }
  }, [order, refunds]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (order) {
      setEditedOrder({ ...order });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleStatusChange = (status: OrderStatus) => {
    setEditedOrder((prev) => (prev ? { ...prev, status: status } : prev));
  };

  const handleSaveClick = () => {
    if (!editedOrder) return;

    // Simulate API update
    setTimeout(() => {
      // Update the order in the orders array
      updateFilters({ order: editedOrder });

      // Update local state
      setOrder({ ...editedOrder });
      setIsEditing(false);

      toast({
        title: "Order updated",
        description: "Your order has been updated successfully.",
      });
    }, 500);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (id) {
      // Simulate API delete
      setTimeout(() => {
        // Remove the order from the orders array
        updateFilters({ orderId: id });

        // Redirect to the orders list
        navigate('/orders');

        toast({
          title: "Order deleted",
          description: "Your order has been deleted successfully.",
        });
      }, 500);
    }
  };

  const handleContractorClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsContractorDialogOpen(true);
  };

  const handleAddContractorClick = () => {
    setNewContractor({
      id: '',
      name: '',
      role: '',
      payoutRate: 0,
      payoutAmount: 0,
      notes: '',
    });
    setIsContractorDialogOpen(true);
  };

  const handleContractorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContractor((prev) => ({ ...prev, [name]: value }));
  };

  const handleContractorPayoutRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewContractor((prev) => ({ ...prev, payoutRate: parseFloat(value) }));
  };

  const handleSaveContractor = () => {
    if (!newContractor.name || !newContractor.role) {
      toast({
        title: "Error",
        description: "Contractor name and role are required.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API save
    setTimeout(() => {
      // Generate a random ID for the new contractor
      const newContractorWithId: Contractor = { ...newContractor, id: generateRandomId() };

      // Add the new contractor to the contractors array
      updateFilters({ contractor: newContractorWithId });

      setIsContractorDialogOpen(false);
      toast({
        title: "Contractor saved",
        description: "Contractor has been saved successfully.",
      });
    }, 500);
  };

  const handleDeleteContractor = () => {
    if (selectedContractor && selectedContractor.id) {
      // Simulate API delete
      setTimeout(() => {
        // Remove the contractor from the contractors array
        updateFilters({ contractorId: selectedContractor.id });

        setIsContractorDialogOpen(false);
        toast({
          title: "Contractor deleted",
          description: "Contractor has been deleted successfully.",
        });
      }, 500);
    }
  };

  const handleRefundClick = () => {
    setIsRefundDialogOpen(true);
  };

  const handleAddRefundClick = () => {
    setIsAddRefundDialogOpen(true);
  };

  const handleRefundInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRefund((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewRefund((prev) => ({ ...prev, amount: parseFloat(value) }));
  };

  const handleIsFullRefundChange = (checked: boolean) => {
    setIsFullRefund(checked);
    setNewRefund((prev) => ({ ...prev, isFullRefund: checked }));
  };

  const handleSaveRefund = () => {
    if (!newRefund.amount || !newRefund.date || !newRefund.reason) {
      toast({
        title: "Error",
        description: "Refund amount, date, and reason are required.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API save
    setTimeout(() => {
      // Generate a random ID for the new refund
      const newRefundWithId: RefundRecord = { ...newRefund, id: generateRandomId(), status: 'pending' };

      // Add the new refund to the refunds array
      updateFilters({ refund: newRefundWithId });

      setIsAddRefundDialogOpen(false);
      toast({
        title: "Refund saved",
        description: "Refund has been saved successfully.",
      });
    }, 500);
  };

  if (isLoading || isContractorsLoading || isRefundsLoading) {
    return <p>Loading order details...</p>;
  }

  if (error || contractorsError || refundsError) {
    return <p>Error: {error || contractorsError || refundsError}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="space-x-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
              <Button variant="destructive" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button onClick={handleSaveClick}>Save</Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Details about the order</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="order_number">Order Number</Label>
              <Input
                type="text"
                id="order_number"
                name="order_number"
                value={editedOrder?.order_number || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select value={editedOrder?.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  id="status"
                  name="status"
                  value={editedOrder?.status || ""}
                  disabled
                />
              )}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={editedOrder?.price || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  type="text"
                  id="scheduled_date"
                  name="scheduled_date"
                  value={editedOrder?.scheduled_date || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
            </div>
            <div>
              <Label htmlFor="scheduled_time">Scheduled Time</Label>
              <Input
                type="text"
                id="scheduled_time"
                name="scheduled_time"
                value={editedOrder?.scheduled_time || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Input
                type="text"
                id="property_type"
                name="property_type"
                value={editedOrder?.property_type || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                type="number"
                id="square_feet"
                name="square_feet"
                value={editedOrder?.square_feet || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Details about the client</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input
                type="text"
                id="client"
                name="client"
                value={editedOrder?.client || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={editedOrder?.clientEmail || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={editedOrder?.clientPhone || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={editedOrder?.address || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={editedOrder?.city || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                id="state"
                name="state"
                value={editedOrder?.state || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="zip">Zip Code</Label>
              <Input
                type="text"
                id="zip"
                name="zip"
                value={editedOrder?.zip || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Photographer Information</CardTitle>
          <CardDescription>Details about the photographer</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="photographer">Photographer Name</Label>
              <Input
                type="text"
                id="photographer"
                name="photographer"
                value={editedOrder?.photographer || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="photographer_payout_rate">Photographer Payout Rate</Label>
              <Input
                type="number"
                id="photographer_payout_rate"
                name="photographer_payout_rate"
                value={editedOrder?.photographer_payout_rate || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Internal and customer notes</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="internal_notes">Internal Notes</Label>
            <Textarea
              id="internal_notes"
              name="internal_notes"
              value={editedOrder?.internal_notes || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="customer_notes">Customer Notes</Label>
            <Textarea
              id="customer_notes"
              name="customer_notes"
              value={editedOrder?.customer_notes || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contractors</CardTitle>
          <CardDescription>Manage contractors associated with this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={handleAddContractorClick}>Add Contractor</Button>
          </div>
          {contractors && contractors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className="cursor-pointer" onClick={() => handleContractorClick(contractor)}>
                  <CardHeader>
                    <CardTitle>{contractor.name}</CardTitle>
                    <CardDescription>{contractor.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Payout Rate: {contractor.payoutRate}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No contractors added yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Refunds</CardTitle>
          <CardDescription>Manage refunds associated with this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={handleAddRefundClick}>Add Refund</Button>
          </div>
          {refundsForOrder && refundsForOrder.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {refundsForOrder.map((refund) => (
                <Card key={refund.id}>
                  <CardHeader>
                    <CardTitle>Refund ID: {refund.id}</CardTitle>
                    <CardDescription>Amount: {refund.amount}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Date: {refund.date}</p>
                    <p>Reason: {refund.reason}</p>
                    <p>Status: {refund.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No refunds added yet.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContractorDialogOpen} onOpenChange={setIsContractorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedContractor ? "Edit Contractor" : "Add Contractor"}</DialogTitle>
            <DialogDescription>
              {selectedContractor ? "Edit the details of the selected contractor." : "Add a new contractor to this order."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={selectedContractor ? selectedContractor.name : newContractor.name}
                onChange={handleContractorInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                type="text"
                id="role"
                name="role"
                value={selectedContractor ? selectedContractor.role : newContractor.role}
                onChange={handleContractorInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payoutRate" className="text-right">
                Payout Rate
              </Label>
              <Input
                type="number"
                id="payoutRate"
                name="payoutRate"
                value={selectedContractor ? selectedContractor.payoutRate : newContractor.payoutRate}
                onChange={handleContractorPayoutRateChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={selectedContractor ? selectedContractor.notes : newContractor.notes}
                onChange={handleContractorInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            {selectedContractor && (
              <Button type="button" variant="destructive" onClick={handleDeleteContractor}>
                Delete
              </Button>
            )}
            <Button type="button" onClick={handleSaveContractor}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Refunds</DialogTitle>
            <DialogDescription>
              Manage refunds associated with this order
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            <div className="mb-4">
              <Button onClick={handleAddRefundClick}>Add Refund</Button>
            </div>
            {refundsForOrder && refundsForOrder.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {refundsForOrder.map((refund) => (
                  <Card key={refund.id}>
                    <CardHeader>
                      <CardTitle>Refund ID: {refund.id}</CardTitle>
                      <CardDescription>Amount: {refund.amount}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Date: {refund.date}</p>
                      <p>Reason: {refund.reason}</p>
                      <p>Status: {refund.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No refunds added yet.</p>
            )}
          </CardContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddRefundDialogOpen} onOpenChange={setIsAddRefundDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Refund</DialogTitle>
            <DialogDescription>
              Add a new refund to this order
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={newRefund.amount}
                onChange={handleRefundAmountChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={newRefund.date}
                onChange={handleRefundInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={newRefund.reason}
                onChange={handleRefundInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isFullRefund" className="text-right">
                Full Refund
              </Label>
              <Checkbox
                id="isFullRefund"
                checked={isFullRefund}
                onCheckedChange={handleIsFullRefundChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveRefund}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
