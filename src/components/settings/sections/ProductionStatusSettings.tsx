import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface ProductionStatus {
  id: string;
  name: string;
  color: string;
  description: string | null;
  is_default: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string | null;
}

export function ProductionStatusSettings() {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<ProductionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProductionStatus | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#94a3b8',
    description: '',
    isDefault: false
  });

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('production_statuses')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error('Error fetching production statuses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load production statuses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isDefault: e.target.checked }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#94a3b8',
      description: '',
      isDefault: false
    });
    setEditingStatus(null);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditClick = (status: ProductionStatus) => {
    setEditingStatus(status);
    setFormData({
      name: status.name,
      color: status.color,
      description: status.description || '',
      isDefault: status.is_default
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      // Check if this is the default status
      const isDefault = statuses.find(s => s.id === id)?.is_default;
      if (isDefault) {
        toast({
          title: 'Cannot Delete',
          description: 'You cannot delete the default status',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('production_statuses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Deleted',
        description: 'Production status has been deleted'
      });
      fetchStatuses();
    } catch (error) {
      console.error('Error deleting status:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete status',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.color) {
        toast({
          title: 'Validation Error',
          description: 'Name and color are required',
          variant: 'destructive'
        });
        return;
      }

      // If setting as default, need to update all other statuses
      if (formData.isDefault) {
        await supabase
          .from('production_statuses')
          .update({ is_default: false })
          .not('id', editingStatus?.id || 'none');
      }

      if (editingStatus) {
        // Update existing
        const { error } = await supabase
          .from('production_statuses')
          .update({
            name: formData.name,
            color: formData.color,
            description: formData.description || null,
            is_default: formData.isDefault,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStatus.id);

        if (error) throw error;
        toast({
          title: 'Status Updated',
          description: 'Production status has been updated'
        });
      } else {
        // Create new
        const maxOrder = Math.max(...statuses.map(s => s.sort_order || 0), 0);
        const { error } = await supabase
          .from('production_statuses')
          .insert({
            name: formData.name,
            color: formData.color,
            description: formData.description || null,
            is_default: formData.isDefault,
            sort_order: maxOrder + 1
          });

        if (error) throw error;
        toast({
          title: 'Status Created',
          description: 'New production status has been created'
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchStatuses();
    } catch (error) {
      console.error('Error saving status:', error);
      toast({
        title: 'Error',
        description: 'Failed to save status',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Production Statuses</CardTitle>
            <CardDescription>
              Manage the status options for production tasks
            </CardDescription>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Status
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">Loading statuses...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Order</TableHead>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[100px]">Color</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Default</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statuses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No production statuses found
                    </TableCell>
                  </TableRow>
                ) : (
                  statuses.map((status) => (
                    <TableRow key={status.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: status.color, color: "#fff" }}>
                          {status.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="h-5 w-5 rounded-full border" 
                            style={{ backgroundColor: status.color }}
                          />
                          <span>{status.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>{status.description || '-'}</TableCell>
                      <TableCell>{status.is_default ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditClick(status)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick(status.id)}
                            disabled={status.is_default}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStatus ? 'Edit Production Status' : 'Add Production Status'}
            </DialogTitle>
            <DialogDescription>
              {editingStatus 
                ? 'Update the details for this production status' 
                : 'Create a new status for production tasks'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Status Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="e.g., In Progress" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="color" 
                  name="color" 
                  type="color" 
                  value={formData.color} 
                  onChange={handleInputChange} 
                  className="w-16 h-10 p-1"
                />
                <Input 
                  name="color" 
                  value={formData.color} 
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Describe what this status means"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="isDefault" 
                name="isDefault" 
                checked={formData.isDefault} 
                onChange={handleCheckboxChange} 
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isDefault" className="text-sm font-normal">
                Set as default status
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingStatus ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
