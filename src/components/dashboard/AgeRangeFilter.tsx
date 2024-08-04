import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { DropdownMenuIcon } from "@radix-ui/react-icons";

interface AgeRangeFilterProps {
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
}

export function AgeRangeFilter({ ageRange, setAgeRange }: AgeRangeFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <DropdownMenuIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Filter</h4>
          <div className="flex flex-col space-y-4">
            <div>
              <label>Age</label>
              <DualRangeSlider
                value={ageRange}
                onValueChange={(value) => {
                  if (value[0] <= value[1]) {
                    setAgeRange([value[0], value[1]]);
                  }
                }}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <div className="flex justify-between">
              <span>Min: {ageRange[0]}</span>
              <span>Max: {ageRange[1]}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
