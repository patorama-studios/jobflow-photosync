
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientNote {
  id: string;
  client_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useClientNotes(clientId: string) {
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setNotes(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch client notes');
      console.error("Error fetching client notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (content: string) => {
    if (!clientId || !content.trim()) return null;
    
    try {
      const newNote = {
        client_id: clientId,
        content: content.trim()
      };
      
      const { data, error } = await supabase
        .from('client_notes')
        .insert([newNote])
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data, ...prev]);
      toast.success("Note added successfully");
      
      return data;
    } catch (err: any) {
      console.error("Error adding note:", err);
      toast.error(`Failed to add note: ${err.message || 'Unknown error'}`);
      return null;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    if (!clientId || !noteId || !content.trim()) return false;
    
    try {
      const { error } = await supabase
        .from('client_notes')
        .update({ content: content.trim(), updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .eq('client_id', clientId);

      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, content, updated_at: new Date().toISOString() } : note
      ));
      
      toast.success("Note updated successfully");
      return true;
    } catch (err: any) {
      console.error("Error updating note:", err);
      toast.error(`Failed to update note: ${err.message || 'Unknown error'}`);
      return false;
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!clientId || !noteId) return false;
    
    try {
      const { error } = await supabase
        .from('client_notes')
        .delete()
        .eq('id', noteId)
        .eq('client_id', clientId);

      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success("Note deleted successfully");
      return true;
    } catch (err: any) {
      console.error("Error deleting note:", err);
      toast.error(`Failed to delete note: ${err.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote
  };
}
