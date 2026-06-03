import type { JSX } from 'react/jsx-runtime';

import { ModelTable } from '@/components/table/ModelTable';
import type { Model } from '@/types/models';

/**
 * Props for ResultsTableSection component.
 *
 * @interface ResultsTableSectionProps
 * @property {Model[]} data - Model data to display.
 * @property {number} perPage - Results per page.
 * @property {number} currentPage - Current page number.
 */
interface ResultsTableSectionProps {
  data: Model[];
  perPage: number;
  currentPage: number;
}

/**
 * Table wrapper for filtered models.
 *
 * @param {ResultsTableSectionProps} props - Component props.
 *
 * @returns {JSX.Element} Results table section.
 */
export function ResultsTableSection({ data, perPage, currentPage }: ResultsTableSectionProps): JSX.Element {
  return (
    <div id="results-table-section" className="overflow-x-auto">
      <ModelTable data={data} perPage={perPage} currentPage={currentPage} />
    </div>
  );
}
