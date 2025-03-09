
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as LucideIcons from 'lucide-react';
import { SafeIcon } from '@/utils/icon-loader';

export default function IconTest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get all available icon names
  const iconNames = Object.keys(LucideIcons).filter(
    name => typeof LucideIcons[name as keyof typeof LucideIcons] === 'function'
  );

  // Filter icons based on search term
  const filteredIcons = searchTerm
    ? iconNames.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : iconNames.slice(0, 50); // Show first 50 icons if no search term

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    setError(null);

    try {
      // Test if the icon can be rendered
      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
      if (!IconComponent) {
        setError(`Icon "${iconName}" exists but cannot be rendered directly.`);
      }
    } catch (err) {
      setError(`Error accessing icon: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="container py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Icon Test Utility</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Search Icons</h2>
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredIcons.map((name) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => handleIconClick(name)}
                className={`text-xs p-2 h-auto flex flex-col items-center ${
                  selectedIcon === name ? 'ring-2 ring-primary' : ''
                }`}
              >
                <SafeIcon name={name} className="h-5 w-5 mb-1" />
                <span className="truncate w-full text-center">{name}</span>
              </Button>
            ))}
          </div>
          
          {filteredIcons.length === 0 && (
            <p className="text-gray-500 mt-2">No icons found matching "{searchTerm}"</p>
          )}
        </div>
        
        {selectedIcon && (
          <div className="mt-6 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Selected Icon: {selectedIcon}</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 border rounded-md">
                <SafeIcon name={selectedIcon} className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Import: <code>{`import { ${selectedIcon} } from 'lucide-react';`}</code>
                </p>
                <p className="text-sm text-gray-600">
                  SafeIcon: <code>{`<SafeIcon name="${selectedIcon}" />`}</code>
                </p>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">React-is Diagnostic</h2>
          <Button 
            onClick={async () => {
              try {
                const reactIs = await import('react-is');
                console.log('react-is loaded successfully:', reactIs);
                setError(`react-is loaded successfully. Exports: ${Object.keys(reactIs).join(', ')}`);
              } catch (err) {
                console.error('Failed to load react-is:', err);
                setError(`Failed to load react-is: ${err instanceof Error ? err.message : String(err)}`);
              }
            }}
          >
            Test react-is Loading
          </Button>
        </div>
      </Card>
    </div>
  );
}
