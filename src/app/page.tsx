import type { JSX } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModelFinder } from '@/components/ModelFinder';
import { SeoContent } from '@/components/seo/SeoContent';
import type { ApiResponse, Model } from '@/types/models';

export const dynamic = 'force-dynamic';

/**
 * Shape returned by normalizeModelCosts.
 *
 * @type {NormalizedCostsType}
 */
type NormalizedCostsType = {
  free: boolean;
  inputCost: number;
  outputCost: number;
  reasoningCost: number;
  cacheReadCost: number;
  cacheWriteCost: number;
  audioInputCost: number;
  audioOutputCost: number;
};

/**
 * Shape returned by normalizeModelLimits.
 *
 * @type {NormalizedLimitsType}
 */
type NormalizedLimitsType = { context: number; inputLimit: number; outputLimit: number };

/**
 * Shape returned by normalizeModelFlags.
 *
 * @type {NormalizedFlagsType}
 */
type NormalizedFlagsType = {
  toolCall: boolean;
  reasoning: boolean;
  structuredOutput: boolean;
  temperature: boolean;
  weights: boolean;
  inputModality: string[];
  outputModality: string[];
};

/**
 * Fetches raw API data from models.dev endpoint.
 *
 * @returns {Promise<ApiResponse>} The raw API response.
 */
async function fetchRawData(): Promise<ApiResponse> {
  const response = await fetch('https://models.dev/api.json', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<ApiResponse>;
}

/**
 * Safely extracts a numeric property from an optional object, defaulting to 0.
 *
 * @param {Record<string, number | undefined> | undefined} obj - Optional object.
 * @param {string} key - Property key to extract.
 *
 * @returns {number} The property value or 0 if missing.
 */
function numProp(obj: Record<string, number | undefined> | undefined, key: string): number {
  return obj?.[key] ?? 0;
}

/**
 * Checks if input cost is zero (free model).
 *
 * @param {{ input?: number } | undefined} cost - Optional cost object.
 *
 * @returns {boolean} True if input cost is zero.
 */
function isFree(cost: { input?: number } | undefined): boolean {
  return cost?.input == 0;
}

/**
 * Normalizes cost-related fields from a raw model entry.
 *
 * @param {ApiResponse[string]['models'][string]} model - Raw model data from the API.
 *
 * @returns {NormalizedCostsType} Normalized cost fields.
 */
function normalizeModelCosts(model: ApiResponse[string]['models'][string]): NormalizedCostsType {
  const c = model.cost;
  return {
    free: isFree(c),
    inputCost: numProp(c, 'input'),
    outputCost: numProp(c, 'output'),
    reasoningCost: numProp(c, 'reasoning'),
    cacheReadCost: numProp(c, 'cache_read'),
    cacheWriteCost: numProp(c, 'cache_write'),
    audioInputCost: numProp(c, 'audio_input'),
    audioOutputCost: numProp(c, 'audio_output'),
  };
}

/**
 * Safely extracts a limit value from the model limits object, defaulting to 0.
 *
 * @param {Record<string, number | undefined> | undefined} limits - Optional limits object.
 * @param {string} key - Property key to extract.
 *
 * @returns {number} The limit value or 0.
 */
function limitVal(limits: Record<string, number | undefined> | undefined, key: string): number {
  return limits?.[key] ?? 0;
}

/**
 * Normalizes limit-related fields from a raw model entry.
 *
 * @param {ApiResponse[string]['models'][string]} model - Raw model data from the API.
 *
 * @returns {NormalizedLimitsType} Normalized limit fields.
 */
function normalizeModelLimits(model: ApiResponse[string]['models'][string]): NormalizedLimitsType {
  const l = model.limit;
  return { context: limitVal(l, 'context'), inputLimit: limitVal(l, 'input'), outputLimit: limitVal(l, 'output') };
}

/**
 * Coerces an optional boolean to a default false.
 *
 * @param {boolean | undefined} value - The optional boolean value.
 *
 * @returns {boolean} False when undefined, otherwise the boolean value.
 */
function orFalse(value: boolean | undefined): boolean {
  return value ?? false;
}

/**
 * Coerces an optional string array to a default fallback.
 *
 * @param {string[] | undefined} arr - The optional array.
 * @param {string[]} fallback - Default fallback value.
 *
 * @returns {string[]} The array or fallback value.
 */
function orDefault(arr: string[] | undefined, fallback: string[]): string[] {
  return arr ?? fallback;
}

/**
 * Normalizes boolean and modality fields from a raw model entry.
 *
 * @param {ApiResponse[string]['models'][string]} model - Raw model data from the API.
 *
 * @returns {NormalizedFlagsType} Normalized boolean and modality fields.
 */
function normalizeModelFlags(model: ApiResponse[string]['models'][string]): NormalizedFlagsType {
  return {
    toolCall: orFalse(model.tool_call),
    reasoning: orFalse(model.reasoning),
    structuredOutput: orFalse(model.structured_output),
    temperature: !!model.temperature,
    weights: orFalse(model.weights),
    inputModality: orDefault(model.modalities?.input, ['text']),
    outputModality: orDefault(model.modalities?.output, ['text']),
  };
}

/**
 * Transforms a single raw model entry into a Model object.
 *
 * @param {object} model - Raw model data from the API.
 * @param {string} providerName - Provider display name.
 * @param {string} providerId - Provider identifier.
 * @param {string} [providerDoc] - Provider documentation URL.
 *
 * @returns {Model} A normalized Model object.
 */
function transformModel(
  model: ApiResponse[string]['models'][string],
  providerName: string,
  providerId: string,
  providerDoc?: string
): Model {
  return {
    id: model.id,
    name: model.name,
    provider: providerName,
    providerId,
    providerDoc,
    family: model.family || 'unknown',
    knowledge: model.knowledge || '',
    releaseDate: model.release_date || '',
    lastUpdated: model.last_updated || '',
    ...normalizeModelCosts(model),
    ...normalizeModelLimits(model),
    ...normalizeModelFlags(model),
  };
}

/**
 * Parses all provider entries from the API response into a flat array of models.
 *
 * @param {ApiResponse} data - The API response object.
 *
 * @returns {Model[]} A flat array of all models.
 */
function parseProviderModels(data: ApiResponse): Model[] {
  const models: Model[] = [];

  for (const providerEntry of Object.values(data)) {
    if (!providerEntry.models) continue;

    for (const model of Object.values(providerEntry.models)) {
      models.push(transformModel(model, providerEntry.name, providerEntry.id, providerEntry.doc));
    }
  }

  return models;
}

/**
 * Fetch models from models.dev API.
 *
 * @returns {Promise<Model[]>} Array of models.
 */
async function fetchModels(): Promise<Model[]> {
  const data = await fetchRawData();
  return parseProviderModels(data);
}

/**
 * Renders the error state when models fail to load.
 *
 * @param {string} errorMessage - The error message to display.
 *
 * @returns {JSX.Element} Error state page element.
 */
function renderErrorState(errorMessage: string): JSX.Element {
  return (
    <main id="error-state" className="flex-1">
      <div className="border-4 border-black bg-white p-6 text-center md:p-12">
        <h2 className="font-heading text-xl font-black text-black uppercase md:text-2xl">Failed to Load Models</h2>
        <p className="text-text-muted mt-2 text-sm md:text-base">{errorMessage}</p>
        <p className="text-text-muted mt-4 text-xs">Please try refreshing the page</p>
      </div>
    </main>
  );
}

/**
 * Home page - Server component
 *
 * @returns {Promise<JSX.Element>} Home page element
 */
export default async function Home(): Promise<JSX.Element> {
  let models: Model[] = [];
  let error: string | null = null;

  try {
    models = await fetchModels();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch models';
    console.error('Page error:', error);
  }

  if (error && models.length === 0) {
    return renderErrorState(error);
  }

  return (
    <main id="main-content" className="flex-1 py-6">
      <ErrorBoundary>
        <ModelFinder initialModels={models} />
      </ErrorBoundary>
      <div className="mt-8">
        <SeoContent />
      </div>
    </main>
  );
}
