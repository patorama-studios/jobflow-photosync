
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Order } from '@/types/order-types';
import { Contractor } from '@/types/orders';
import { generateRandomId } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface ContractorsSectionProps {
  order: Order;
  contractors?: Contractor[];
}

export function ContractorsSection({ order, contractors = [] }: ContractorsSectionProps) {
  const [isContractorDialogOpen, setIsContractorDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [newContractor, setNewContractor] = useState<Contractor>({
    id: '',
    name: '',
    role: '',
    payoutRate: 0,
    payoutAmount: 0,
    notes: '',
  });
  const { toast } = useToast();

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

      toast({
        title: "Contractor saved",
        description: "Contractor has been saved successfully.",
      });
      
      setIsContractorDialogOpen(false);
    }, 500);
  };

  const handleDeleteContractor = () => {
    if (selectedContractor && selectedContractor.id) {
      // Simulate API delete
      setTimeout(() => {
        toast({
          title: "Contractor deleted",
          description: "Contractor has been deleted successfully.",
        });
        
        setIsContractorDialogOpen(false);
      }, 500);
    }
  };

  return (
    <>
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
    </>
  );
}
