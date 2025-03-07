
import { Checkbox } from "@/components/ui/checkbox";
import { usePhotographers } from "@/hooks/use-photographers";
import { Photographer } from "@/hooks/use-photographers";

type PhotographerFilterProps = {
  selectedPhotographers: number[];
  onToggle: (id: number) => void;
  isMobile?: boolean;
  photographers?: Photographer[];
};

export function PhotographerFilter({ 
  selectedPhotographers, 
  onToggle,
  isMobile = false,
  photographers: propPhotographers
}: PhotographerFilterProps) {
  const { photographers: hookPhotographers, isLoading } = usePhotographers();
  
  // Use photographers from props if provided, otherwise use from hook
  const photographers = propPhotographers || hookPhotographers;

  if (isLoading && !propPhotographers) {
    return (
      <div className="mb-4">
        <h3 className={`text-sm font-medium mb-3 ${!isMobile && 'px-3'}`}>Photographers</h3>
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`flex items-center space-x-2 py-1 ${!isMobile && 'px-3'}`}
            >
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className={`text-sm font-medium mb-3 ${!isMobile && 'px-3'}`}>Photographers</h3>
      <div className="space-y-2">
        {photographers.map((photographer) => (
          <div 
            key={photographer.id} 
            className={`flex items-center space-x-2 py-1 ${!isMobile && 'px-3'}`}
          >
            <Checkbox 
              id={`${isMobile ? 'mobile-' : ''}photographer-${photographer.id}`}
              checked={selectedPhotographers.includes(photographer.id)}
              onCheckedChange={() => onToggle(photographer.id)}
            />
            <label 
              htmlFor={`${isMobile ? 'mobile-' : ''}photographer-${photographer.id}`}
              className="text-sm flex items-center cursor-pointer"
            >
              <span 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: photographer.color }}
              ></span>
              {photographer.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
