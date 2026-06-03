import type { JSX } from 'react';

import {
  CONTEXT_WINDOW_DEFAULTS,
  PRICE_RANGE_DEFAULTS,
  YEAR_FILTER_END_OFFSET,
  YEAR_FILTER_START,
} from '@/components/filters/constants/rangeFilters';
import { FilterGroup } from '@/components/filters/FilterGroup';
import { PriceRangeSlider } from '@/components/filters/PriceRangeSlider';
import { SearchableSelect } from '@/components/filters/SearchableSelect';
import type { FilterState } from '@/types/models';

/**
 * Props for RangeFiltersSection component.
 *
 * @interface RangeFiltersSectionProps
 * @property {FilterState} filters - Current filter state.
 * @property {(next: Partial<FilterState>) => void} onFilterChange - Callback for filter changes.
 */
interface RangeFiltersSectionProps {
  filters: FilterState;
  onFilterChange: (next: Partial<FilterState>) => void;
}

/**
 * Generates a list of year strings from YEAR_FILTER_START to the current year plus offset.
 *
 * @returns {string[]} Array of year strings.
 */
function getYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + YEAR_FILTER_END_OFFSET;
  return Array.from({ length: maxYear - YEAR_FILTER_START + 1 }, (_, index) => String(YEAR_FILTER_START + index));
}

/**
 * Resolves the selected year when both min and max are equal, or returns empty string.
 *
 * @param {string} minYear - Minimum year filter value.
 * @param {string} maxYear - Maximum year filter value.
 *
 * @returns {string} The selected year or empty string.
 */
function resolveSelectedYear(minYear: string, maxYear: string): string {
  return minYear && maxYear ? minYear : '';
}

/**
 * Renders input/output cost sliders.
 *
 * @param {object} params - Function params.
 * @param {FilterState} params.filters - Current filter state.
 * @param {(next: Partial<FilterState>) => void} params.onFilterChange - Callback for filter changes.
 *
 * @returns {JSX.Element} Price sliders section.
 */
function PriceSlidersSection({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (next: Partial<FilterState>) => void;
}): JSX.Element {
  return (
    <>
      <PriceRangeSlider
        id="input-cost"
        min={PRICE_RANGE_DEFAULTS.min}
        max={PRICE_RANGE_DEFAULTS.max}
        step={PRICE_RANGE_DEFAULTS.step}
        minValue={parseFloat(filters.minInputCost) || PRICE_RANGE_DEFAULTS.min}
        maxValue={parseFloat(filters.maxInputCost) || PRICE_RANGE_DEFAULTS.max}
        onMinChange={(value: number) => onFilterChange({ minInputCost: String(value) })}
        onMaxChange={(value: number) => onFilterChange({ maxInputCost: String(value) })}
        label="Input Cost ($/M)"
      />
      <PriceRangeSlider
        id="output-cost"
        min={PRICE_RANGE_DEFAULTS.min}
        max={PRICE_RANGE_DEFAULTS.max}
        step={PRICE_RANGE_DEFAULTS.step}
        minValue={parseFloat(filters.minOutputCost) || PRICE_RANGE_DEFAULTS.min}
        maxValue={parseFloat(filters.maxOutputCost) || PRICE_RANGE_DEFAULTS.max}
        onMinChange={(value: number) => onFilterChange({ minOutputCost: String(value) })}
        onMaxChange={(value: number) => onFilterChange({ maxOutputCost: String(value) })}
        label="Output Cost ($/M)"
      />
    </>
  );
}

/**
 * Renders the context window slider.
 *
 * @param {object} params - Function params.
 * @param {FilterState} params.filters - Current filter state.
 * @param {(next: Partial<FilterState>) => void} params.onFilterChange - Callback for filter changes.
 *
 * @returns {JSX.Element} Context slider.
 */
function ContextSliderSection({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (next: Partial<FilterState>) => void;
}): JSX.Element {
  return (
    <PriceRangeSlider
      id="context-window"
      min={CONTEXT_WINDOW_DEFAULTS.min}
      max={CONTEXT_WINDOW_DEFAULTS.max}
      step={CONTEXT_WINDOW_DEFAULTS.step}
      minValue={parseInt(filters.minContext, 10) || CONTEXT_WINDOW_DEFAULTS.min}
      maxValue={parseInt(filters.maxContext, 10) || CONTEXT_WINDOW_DEFAULTS.max}
      onMinChange={(value: number) => onFilterChange({ minContext: String(value) })}
      onMaxChange={(value: number) => onFilterChange({ maxContext: String(value) })}
      label="Context Window"
    />
  );
}

/**
 * Renders release and knowledge year select filters.
 *
 * @param {object} params - Function params.
 * @param {FilterState} params.filters - Current filter state.
 * @param {(next: Partial<FilterState>) => void} params.onFilterChange - Callback for filter changes.
 *
 * @returns {JSX.Element} Year selects section.
 */
function YearFiltersSection({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (next: Partial<FilterState>) => void;
}): JSX.Element {
  const yearOptions = getYearOptions();
  const selectedReleaseYear = resolveSelectedYear(filters.minReleaseYear, filters.maxReleaseYear);
  const selectedKnowledgeYear = resolveSelectedYear(filters.minKnowledge, filters.maxKnowledge);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      <FilterGroup label="Release Year" id="release-year">
        <SearchableSelect
          id="release-year"
          options={yearOptions}
          value={selectedReleaseYear}
          onValueChange={(value: string) => onFilterChange({ minReleaseYear: value, maxReleaseYear: value })}
          placeholder="Select year..."
        />
      </FilterGroup>
      <FilterGroup label="Knowledge Year" id="knowledge-year">
        <SearchableSelect
          id="knowledge-year"
          options={yearOptions}
          value={selectedKnowledgeYear}
          onValueChange={(value: string) => onFilterChange({ minKnowledge: value, maxKnowledge: value })}
          placeholder="Select year..."
        />
      </FilterGroup>
    </div>
  );
}

/**
 * Range slider filters section.
 *
 * @param {RangeFiltersSectionProps} props - Component props.
 *
 * @returns {JSX.Element} Range filters section.
 */
export function RangeFiltersSection({ filters, onFilterChange }: RangeFiltersSectionProps): JSX.Element {
  return (
    <div id="range-filters-section" className="space-y-3 md:space-y-4">
      <PriceSlidersSection filters={filters} onFilterChange={onFilterChange} />
      <ContextSliderSection filters={filters} onFilterChange={onFilterChange} />
      <YearFiltersSection filters={filters} onFilterChange={onFilterChange} />
    </div>
  );
}
