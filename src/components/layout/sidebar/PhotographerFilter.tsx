
import { Checkbox } from "@/components/ui/checkbox";

type Photographer = {
  id: number;
  name: string;
  color: string;
};

type PhotographerFilterProps = {
  photographers: Photographer[];
  selectedPhotographers: number[];
  onToggle: (id: number) => void;
  isMobile?: boolean;
};

export function PhotographerFilter({ 
  photographers, 
  selectedPhotographers, 
  onToggle,
  isMobile = false
}: PhotographerFilterProps) {
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
