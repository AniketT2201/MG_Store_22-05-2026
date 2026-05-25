import * as React from "react";
import { ChevronDown } from 'lucide-react';
import { useFilterStore } from '../../../store/filterStore';
import { FilterState } from '../../../types';

const sortOptions: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export function SortDropdown() {
  const { sortBy, setSortBy } = useFilterStore();

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
        className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
