import type { JSX } from 'react';

import { FileText, Image as ImageIcon, Video, FileMusic, FileBox } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';

/**
 * Props for ModalityCell component.
 *
 * @interface ModalityCellProps
 * @property {string[]} values - Modality values.
 */
interface ModalityCellProps {
  values: string[];
}

/**
 * Icon lookup for modality types.
 *
 * @type {Record<string, JSX.Element>}
 */
const MODALITY_ICONS: Record<string, JSX.Element> = {
  audio: <FileMusic className="h-4 w-4 text-black" aria-hidden="true" />,
  video: <Video className="h-4 w-4 text-black" aria-hidden="true" />,
  image: <ImageIcon className="h-4 w-4 text-black" aria-hidden="true" />,
  pdf: <FileBox className="h-4 w-4 text-black" aria-hidden="true" />,
};

/**
 * Resolves modality icon element by label.
 *
 * @param {string} modality - Modality label.
 *
 * @returns {JSX.Element} Modality icon.
 */
function getModalityIcon(modality: string): JSX.Element {
  return MODALITY_ICONS[modality] ?? <FileText className="h-4 w-4 text-black" aria-hidden="true" />;
}

/**
 * Renders modality chips as icon tooltips.
 *
 * @param {ModalityCellProps} props - Component props.
 * @param {string[]} props.values - Modality values.
 *
 * @returns {JSX.Element} Modality cell.
 */
export function ModalityCell({ values }: ModalityCellProps): JSX.Element {
  return (
    <div className="flex w-10 flex-wrap gap-1.5">
      {values.map((modalityValue) => (
        <Tooltip key={modalityValue}>
          <TooltipTrigger asChild>
            <button className="cursor-pointer">{getModalityIcon(modalityValue)}</button>
          </TooltipTrigger>
          <TooltipContent>{modalityValue}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
