import type { FilterState, Model } from '@/types/models';

import { extractYear } from './formatters';

/**
 * Converts a select value to a boolean or null for filtering.
 *
 * @param {string} value - The string value ('true', 'false', or 'any').
 *
 * @returns {boolean | null} `true` for 'true', `false` for 'false', `null` for 'any'.
 */
export const booleanValue = (value: string): boolean | null => (value === 'any' ? null : value === 'true');

/**
 * Converts a boolean or null filter value to a display string.
 *
 * @param {boolean | null} value - The filter value.
 *
 * @returns {string} `'true'` for true, `'false'` for false, `'any'` for null.
 */
export const booleanDisplay = (value: boolean | null): string => (value === null ? 'any' : String(value));

/**
 * Checks if a model matches the search query.
 *
 * @param {Model} model - The model to check.
 * @param {string} search - The search query string.
 *
 * @returns {boolean} True if model name or ID includes the search query.
 */
function filterBySearch(model: Model, search: string): boolean {
  const searchLowerValue = search.toLowerCase();
  return model.name.toLowerCase().includes(searchLowerValue) || model.id.toLowerCase().includes(searchLowerValue);
}

/**
 * Checks if a model matches the specified provider.
 *
 * @param {Model} model - The model to check.
 * @param {string | undefined} provider - Target provider name; skips check when undefined.
 *
 * @returns {boolean} True if the provider matches or no filter is set.
 */
function matchesProvider(model: Model, provider: string | undefined): boolean {
  return !provider || model.provider === provider;
}

/**
 * Checks if a model matches the specified family.
 *
 * @param {Model} model - The model to check.
 * @param {string | undefined} family - Target model family; skips check when undefined.
 *
 * @returns {boolean} True if the family matches or no filter is set.
 */
function matchesFamily(model: Model, family: string | undefined): boolean {
  return !family || model.family === family;
}

/**
 * Checks if a boolean field matches a nullable filter value.
 *
 * @param {boolean} modelValue - The model's boolean field value.
 * @param {boolean | null} filterValue - The filter value; null skips the check.
 *
 * @returns {boolean} True when the filter is null or the values match.
 */
function matchesBooleanField(modelValue: boolean, filterValue: boolean | null): boolean {
  return filterValue === null || modelValue === filterValue;
}

/**
 * Checks if a model's boolean filters (toolCall, reasoning, free) match.
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes all boolean filter checks.
 */
function matchesBooleans(model: Model, filters: FilterState): boolean {
  if (!matchesBooleanField(model.toolCall, filters.toolCall)) return false;
  if (!matchesBooleanField(model.reasoning, filters.reasoning)) return false;
  if (!matchesBooleanField(model.free, filters.free)) return false;
  return true;
}

/**
 * Checks if a model's modality fields match the filters.
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes all modality checks.
 */
function matchesModality(model: Model, filters: FilterState): boolean {
  if (filters.inputModality && !model.inputModality.includes(filters.inputModality)) return false;
  if (filters.outputModality && !model.outputModality.includes(filters.outputModality)) return false;
  return true;
}

/**
 * Checks if a model matches the exact match filters (provider, family, booleans).
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes all exact match checks.
 */
function filterByExactMatch(model: Model, filters: FilterState): boolean {
  return (
    matchesProvider(model, filters.provider)
    && matchesFamily(model, filters.family)
    && matchesBooleans(model, filters)
    && matchesModality(model, filters)
  );
}

/**
 * Checks if a numeric value falls within a specified min/max range.
 *
 * @param {number} value - The value to check.
 * @param {string | undefined} min - Minimum bound as string; skips check when undefined.
 * @param {string | undefined} max - Maximum bound as string; skips check when undefined.
 *
 * @returns {boolean} True if the value is within range or no bounds are set.
 */
function withinRange(value: number, min: string | undefined, max: string | undefined): boolean {
  if (min && value < parseFloat(min)) return false;
  if (max && value > parseFloat(max)) return false;
  return true;
}

/**
 * Checks if a model's input/output costs fall within the filter ranges.
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes all cost range checks.
 */
function filterByCost(model: Model, filters: FilterState): boolean {
  if (!withinRange(model.inputCost, filters.minInputCost, filters.maxInputCost)) return false;
  if (!withinRange(model.outputCost, filters.minOutputCost, filters.maxOutputCost)) return false;
  return true;
}

/**
 * Checks if a model's context window falls within the filter range.
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes context range checks.
 */
function filterByContext(model: Model, filters: FilterState): boolean {
  return withinRange(model.context, filters.minContext, filters.maxContext);
}

/**
 * Checks if a parsed year value falls within the specified min/max year bounds.
 *
 * @param {number} yearValue - The extracted year value.
 * @param {string | undefined} minYear - Minimum year bound as string.
 * @param {string | undefined} maxYear - Maximum year bound as string.
 *
 * @returns {boolean} True if the year is within bounds or no bounds are set.
 */
function matchesYearRange(yearValue: number, minYear: string | undefined, maxYear: string | undefined): boolean {
  if (!minYear && !maxYear) return true;
  if (minYear && yearValue < parseInt(minYear, 10)) return false;
  if (maxYear && yearValue > parseInt(maxYear, 10)) return false;
  return true;
}

/**
 * Checks if a model's knowledge cutoff year falls within the filter range.
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes knowledge year range checks.
 */
function filterByKnowledgeYear(model: Model, filters: FilterState): boolean {
  const knowledgeYearValue = extractYear(model.knowledge);
  return matchesYearRange(knowledgeYearValue, filters.minKnowledge, filters.maxKnowledge);
}

/**
 * Checks if a model's release year falls within the filter range.
 *
 * @param {Model} model - The model to check.
 * @param {FilterState} filters - Filter state.
 *
 * @returns {boolean} True if the model passes release year range checks.
 */
function filterByReleaseYear(model: Model, filters: FilterState): boolean {
  const releaseYearValue = extractYear(model.releaseDate);
  return matchesYearRange(releaseYearValue, filters.minReleaseYear, filters.maxReleaseYear);
}

/**
 * Checks if a single model passes all active filters.
 *
 * @param {Model} modelItem - The model to check.
 * @param {FilterState} filters - Filter state object.
 *
 * @returns {boolean} True if the model passes all filter checks.
 */
function passesAllFilters(modelItem: Model, filters: FilterState): boolean {
  if (filters.search && !filterBySearch(modelItem, filters.search)) return false;
  if (!filterByExactMatch(modelItem, filters)) return false;
  if (!filterByCost(modelItem, filters)) return false;
  if (!filterByContext(modelItem, filters)) return false;
  if (!filterByKnowledgeYear(modelItem, filters)) return false;
  if (!filterByReleaseYear(modelItem, filters)) return false;
  return true;
}

/**
 * Applies filters to a models array based on filter state.
 *
 * @param {Model[]} models - Array of models to filter.
 * @param {FilterState} filters - Filter state object.
 *
 * @returns {Model[]} Filtered models array.
 */
export const applyFilters = (models: Model[], filters: FilterState): Model[] => {
  return models.filter((modelItem) => passesAllFilters(modelItem, filters));
};
