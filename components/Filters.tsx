"use client";

import { useState, useCallback, useEffect } from "react";

interface FilterOption {
  name: string;
  terms: {
    uid: string;
    name: string;
    count: number;
    disabled: boolean;
  }[];
}

interface ProductFiltersProps {
  filterOptions: FilterOption[];
  onFiltersChange: (filters: Record<string, string[]>) => void;
  loading?: boolean;
}

export default function ProductFilters({
  filterOptions,
  onFiltersChange,
  loading = false,
}: ProductFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<{
    [taxonomyName: string]: string[];
  }>({});

  // Notify parent when filters change (after state update)
  useEffect(() => {
    onFiltersChange(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  const handleFilterChange = useCallback(
    (taxonomyName: string, termUid: string, checked: boolean) => {
      setSelectedFilters((prev) => {
        const current = prev[taxonomyName] || [];
        const updated = checked
          ? [...current, termUid]
          : current.filter((uid) => uid !== termUid);

        const newFilters = { ...prev };
        if (updated.length === 0) {
          delete newFilters[taxonomyName];
        } else {
          newFilters[taxonomyName] = updated;
        }

        return newFilters;
      });
    },
    []
  );

  return (
    <div className="space-y-6">
      {filterOptions.map((category) => (
        <div key={category.name}>
          <h3 className="text-base font-light uppercase mb-3">
            {category.name}
          </h3>
          <div className="space-y-2">
            {category.terms.map((term) => {
              const isChecked =
                selectedFilters[category.name]?.includes(term.uid) ?? false;
              const isDisabled = loading || term.disabled;

              return (
                <label
                  key={term.uid}
                  className={`flex items-center space-x-2 ${
                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleFilterChange(
                        category.name,
                        term.uid,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                    disabled={isDisabled}
                  />
                  <span className="text-sm font-light flex-1">
                    <>{term.name}</>
                    <span className="ml-2 bg-gray-100 p-1 rounded text-grey-900 text-xs">
                      {term.count}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
