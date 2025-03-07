
import { useState, useEffect } from "react";
import { Pencil, Save, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClientNotes } from "@/hooks/use-client-notes";
import { formatDistanceToNow } from "date-fns";

interface ClientNotesProps {
  clientId: string;
}

export function ClientNotes({ clientId }: ClientNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const { 
    notes, 
    isLoading, 
    fetchNotes, 
    addNote, 
    updateNote, 
    deleteNote 
  } = useClientNotes(clientId);
  
  useEffect(() => {
    if (clientId) {
      fetchNotes();
    }
  }, [clientId]);
  
  const handleAddNote = async () => {
    if (newNote.trim() === "") return;
    
    await addNote(newNote);
    setNewNote("");
    setIsAddingNote(false);
  };
  
  const handleEditNote = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };
  
  const handleUpdateNote = async (id: string) => {
    if (editContent.trim() === "") return;
    
    await updateNote(id, editContent);
    setEditingId(null);
    setEditContent("");
  };
  
  const handleDeleteNote = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Notes</CardTitle>
        {!isAddingNote && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingNote && (
          <div className="mb-6 space-y-2">
            <Textarea 
              placeholder="Write your note here..." 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote("");
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddNote}
                disabled={newNote.trim() === ""}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No notes found for this client.
            {!isAddingNote && (
              <Button 
                variant="link" 
                onClick={() => setIsAddingNote(true)}
              >
                Add the first note
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-md p-4">
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingId(null);
                          setEditContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={editContent.trim() === ""}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 whitespace-pre-wrap">{note.content}</div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(note.updated_at)}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditNote(note.id, note.content)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
