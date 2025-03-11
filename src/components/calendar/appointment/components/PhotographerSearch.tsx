
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel } from '@/components/ui/form';
import { SearchIcon, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Photographer {
  id: string;
  name: string;
  email?: string;
  color?: string;
  payoutRate?: number;
}

interface PhotographerSearchProps {
  onPhotographerSelect: (photographer: Photographer) => void;
  selectedPhotographer?: string;
}

export const PhotographerSearch: React.FC<PhotographerSearchProps> = ({
  onPhotographerSelect,
  selectedPhotographer
}) => {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhotographers, setFilteredPhotographers] = useState<Photographer[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch photographers from profiles table with role=photographer
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .eq('role', 'photographer');
        
        if (error) throw error;
        
        const mappedPhotographers = data.map((profile): Photographer => ({
          id: profile.id,
          name: profile.full_name || profile.username || 'Photographer',
          email: profile.email || '',
          color: getColorForName(profile.full_name || profile.username || ''),
          payoutRate: 100 // Default payout rate
        }));
        
        setPhotographers(mappedPhotographers);
      } catch (err) {
        console.error('Error fetching photographers:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch photographers'));
        toast.error("Failed to load photographers. Using demo data instead.");
        
        // Set default photographers in case of error
        setPhotographers([
          { id: '1', name: 'Maria Garcia', color: '#4f46e5', payoutRate: 120 },
          { id: '2', name: 'Alex Johnson', color: '#10b981', payoutRate: 110 },
          { id: '3', name: 'Wei Chen', color: '#f59e0b', payoutRate: 115 },
          { id: '4', name: 'Aisha Patel', color: '#ef4444', payoutRate: 105 },
          { id: '5', name: 'Carlos Rodriguez', color: '#8b5cf6', payoutRate: 100 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPhotographers();
  }, []);

  useEffect(() => {
    if (photographers && searchQuery) {
      const filtered = photographers.filter(photographer => 
        photographer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photographer.email && photographer.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPhotographers(filtered);
    } else {
      setFilteredPhotographers(photographers || []);
    }
  }, [searchQuery, photographers]);

  const handleInputFocus = () => {
    setShowResults(true);
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for selection
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleSelect = (photographer: Photographer) => {
    onPhotographerSelect(photographer);
    setShowResults(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Generate a consistent color based on name
  const getColorForName = (name: string): string => {
    const colors = [
      '#4f46e5', // Indigo
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Violet
      '#06b6d4', // Cyan
      '#ec4899', // Pink
      '#84cc16', // Lime
    ];
    
    // Simple hash function for name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-2 relative">
      <FormItem>
        <FormLabel>Photographer</FormLabel>
        <div className="relative">
          <Input
            placeholder="Search for photographer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="pr-10"
            disabled={isLoading}
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </FormItem>

      {showResults && (
        <div className="absolute z-10 w-full bg-background border rounded-md overflow-hidden shadow-md">
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-center text-muted-foreground">Loading photographers...</div>
            ) : filteredPhotographers.length > 0 ? (
              filteredPhotographers.map((photographer) => (
                <div
                  key={photographer.id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                  onClick={() => handleSelect(photographer)}
                >
                  <Avatar className="h-8 w-8" style={{ backgroundColor: photographer.color }}>
                    <AvatarFallback>{getInitials(photographer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{photographer.name}</div>
                    {photographer.email && (
                      <div className="text-xs text-muted-foreground">{photographer.email}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-center text-muted-foreground">
                No photographers found
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPhotographer && (
        <div className="mt-2 border rounded-md p-2 flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span>{selectedPhotographer}</span>
        </div>
      )}
    </div>
  );
};
