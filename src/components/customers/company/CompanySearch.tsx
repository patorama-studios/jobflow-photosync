
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Company, useCompanies } from '@/hooks/use-companies';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CompanySearchProps {
  onCompanySelect: (company: Company) => void;
  onAddNewClick: () => void;
  selectedCompany?: string;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({
  onCompanySelect,
  onAddNewClick,
  selectedCompany
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchCompanies } = useCompanies();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        try {
          const results = await searchCompanies(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching companies:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchCompanies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectCompany = (company: Company) => {
    onCompanySelect(company);
    setSearchQuery(company.name);
    setShowResults(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
            onFocus={() => setShowResults(true)}
          />
          {showResults && searchQuery.length > 2 && (
            <div className="absolute z-10 w-full mt-1 border rounded-md bg-background shadow-lg">
              {isLoading ? (
                <div className="p-2 text-center text-sm">Searching...</div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((company) => (
                    <li
                      key={company.id}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectCompany(company)}
                    >
                      <div className="font-medium">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.email}</div>
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length > 2 ? (
                <div className="p-2 text-center text-sm">No companies found</div>
              ) : null}
            </div>
          )}
        </div>
        <Button type="button" variant="outline" onClick={onAddNewClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>
  );
};
