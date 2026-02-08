/**
 * FilterBar - Compound Component
 * Reusable filter component for event listings
 */

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  Input,
  Select,
  Button,
  Flex,
  Stack,
} from "~/app/_components/primitives";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cityValue: string;
  onCityChange: (value: string) => void;
  typeValue: string;
  onTypeChange: (value: string) => void;
  distanceValue: string;
  onDistanceChange: (value: string) => void;
  dateFromValue: string;
  onDateFromChange: (value: string) => void;
  dateToValue: string;
  onDateToChange: (value: string) => void;
  onSubmitEvent?: () => void;
  isLoading?: boolean;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      searchValue,
      onSearchChange,
      cityValue,
      onCityChange,
      typeValue,
      onTypeChange,
      distanceValue,
      onDistanceChange,
      dateFromValue,
      onDateFromChange,
      dateToValue,
      onDateToChange,
      onSubmitEvent,
      isLoading = false,
    },
    ref
  ) => {
    return (
      <Card ref={ref}>
        <CardContent>
          <Stack gap="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Search Events"
                placeholder="Search by name..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />

              <Input
                label="City"
                placeholder="Filter by city..."
                value={cityValue}
                onChange={(e) => onCityChange(e.target.value)}
              />

              <Select
                label="Event Type"
                placeholder="Choose type"
                value={typeValue}
                onChange={(e) => onTypeChange(e.target.value)}
                options={[
                  { value: "5K", label: "5K" },
                  { value: "10K", label: "10K" },
                  { value: "Half Marathon", label: "Half Marathon" },
                  { value: "Marathon", label: "Marathon" },
                  { value: "Trail Run", label: "Trail Run" },
                  { value: "Ultra Marathon", label: "Ultra Marathon" },
                  { value: "Virtual", label: "Virtual" },
                ]}
              />

              <Select
                label="Distance"
                placeholder="Choose distance"
                value={distanceValue}
                onChange={(e) => onDistanceChange(e.target.value)}
                options={[
                  { value: "5K", label: "5K" },
                  { value: "10K", label: "10K" },
                  { value: "Half Marathon", label: "Half Marathon" },
                  { value: "Marathon", label: "Marathon" },
                  { value: "Trail", label: "Trail" },
                  { value: "Various", label: "Various" },
                ]}
              />

              <Input
                label="Date From"
                type="date"
                value={dateFromValue}
                onChange={(e) => onDateFromChange(e.target.value)}
              />

              <Input
                label="Date To"
                type="date"
                value={dateToValue}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </div>
          </Stack>
        </CardContent>

        {onSubmitEvent && (
          <CardFooter>
            <Flex justify="end">
              <Button
                variant="primary"
                onClick={onSubmitEvent}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit Your Event"}
              </Button>
            </Flex>
          </CardFooter>
        )}
      </Card>
    );
  }
);

FilterBar.displayName = "FilterBar";
