
import { useState, useEffect } from 'react';
import { Contractor } from './types';
import { toast } from 'sonner';

export const useContractorPayouts = (orderId: string | number) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [totalOrderAmount, setTotalOrderAmount] = useState<number>(0);
  const [editingContractorId, setEditingContractorId] = useState<string | number | null>(null);
  const [newContractor, setNewContractor] = useState<Partial<Contractor>>({
    name: '',
    role: 'photographer',
    payoutRate: undefined,
    payoutAmount: undefined,
    notes: ''
  });
  const [showNewContractorForm, setShowNewContractorForm] = useState(false);

  useEffect(() => {
    // Fetch order total and contractors
    const fetchData = async () => {
      if (!orderId) return;

      try {
        // Using mock data since we're not accessing Supabase here
        const mockOrderPrice = 1500; // Sample price
        setTotalOrderAmount(mockOrderPrice);
        
        // For demo purposes, using mock data instead of DB query
        setContractors([
          {
            id: '1',
            name: 'John Photographer',
            role: 'photographer',
            payoutRate: 70,
            payoutAmount: mockOrderPrice * 0.7,
            notes: 'Primary photographer'
          },
          {
            id: '2',
            name: 'Sarah Editor',
            role: 'editor',
            payoutRate: 20,
            payoutAmount: mockOrderPrice * 0.2,
            notes: 'Photo editing'
          }
        ]);
      } catch (err) {
        console.error('Error fetching contractor data:', err);
        toast.error('Failed to load contractor information');
      }
    };

    fetchData();
  }, [orderId]);

  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractorId(contractor.id);
  };

  const handleSaveContractor = (editedContractor: Contractor) => {
    const updatedContractors = contractors.map(c => 
      c.id === editedContractor.id ? editedContractor : c
    );
    setContractors(updatedContractors);
    setEditingContractorId(null);
    
    toast.success(`${editedContractor.name}'s payment details have been updated.`);
  };

  const handleDeleteContractor = (contractorId: string | number) => {
    const updatedContractors = contractors.filter(c => c.id !== contractorId);
    setContractors(updatedContractors);
    
    toast.success("The contractor has been removed from this order.");
  };

  const handleAddNewContractor = (contractor: Contractor) => {
    if (!contractor.name) {
      toast.error("Please enter a name for the contractor.");
      return;
    }

    const newContractorWithId: Contractor = {
      ...contractor,
      id: `temp-${Date.now()}`  // In a real app, this would be a UUID or DB-generated ID
    };

    setContractors([...contractors, newContractorWithId]);
    setNewContractor({
      name: '',
      role: 'photographer',
      payoutRate: undefined,
      payoutAmount: undefined,
      notes: ''
    });
    setShowNewContractorForm(false);

    toast.success(`${newContractorWithId.name} has been added to this order.`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Contractor
  ) => {
    const value = field === 'payoutRate' || field === 'payoutAmount' 
      ? parseFloat(e.target.value) 
      : e.target.value;

    // Adding new contractor
    const updatedNewContractor = { ...newContractor, [field]: value };
    
    // If payoutRate changes, calculate payoutAmount
    if (field === 'payoutRate' && !isNaN(value as number)) {
      updatedNewContractor.payoutAmount = totalOrderAmount * (value as number) / 100;
    }
    
    // If payoutAmount changes, calculate payoutRate
    if (field === 'payoutAmount' && !isNaN(value as number) && totalOrderAmount > 0) {
      updatedNewContractor.payoutRate = ((value as number) / totalOrderAmount) * 100;
    }
    
    setNewContractor(updatedNewContractor);
  };

  const handleSelectChange = (
    value: string,
    field: keyof Contractor
  ) => {
    // Adding new contractor
    setNewContractor(prev => ({ ...prev, [field]: value }));
  };

  return {
    contractors,
    totalOrderAmount,
    editingContractorId,
    setEditingContractorId,
    newContractor,
    setNewContractor,
    showNewContractorForm,
    setShowNewContractorForm,
    handleEditContractor,
    handleSaveContractor,
    handleDeleteContractor,
    handleAddNewContractor,
    handleInputChange,
    handleSelectChange
  };
};
