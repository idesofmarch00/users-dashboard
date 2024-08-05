import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Importing Popover components for creating a dropdown menu
import { Button } from "@/components/ui/button"; // Importing Button component for interactive elements
import { DualRangeSlider } from "@/components/ui/dual-range-slider"; // Importing DualRangeSlider for age range selection
import { FilterIcon } from "lucide-react";

// Defining the interface for AgeRangeFilterProps
interface AgeRangeFilterProps {
  ageRange: [number, number]; // Represents the current age range selected
  setAgeRange: (range: [number, number]) => void; // Function to update the age range state
  resetFilter: () => void; // Function to reset the filter
}

// AgeRangeFilter component
export function AgeRangeFilter({
  ageRange,
  setAgeRange,
  resetFilter,
}: AgeRangeFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <FilterIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter</h4>
            <Button
              variant="ghost"
              onClick={resetFilter}
              className="border rounded-xl px-2 py-1 text-xs"
            >
              Reset
            </Button>
          </div>
          <div className="">
            <label className="text-sm font-medium">Age</label>
            <DualRangeSlider
              value={ageRange}
              onValueChange={(value) => {
                // Ensuring the minimum age is not greater than the maximum age before updating the state
                if (value[0] <= value[1]) {
                  setAgeRange([value[0], value[1]]);
                }
              }}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {ageRange[0]} years</span>
              <span>Max: {ageRange[1]} years</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
