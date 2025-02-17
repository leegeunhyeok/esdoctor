import { cn } from '@/lib/utils';
import { bytesToText } from '@/src/utils/filesize';
import { isNotNil } from 'es-toolkit';

export const tooltip = {
  className: cn('!bg-background', '!border', '!rounded-md', '!text-gray-1000'),
  formatter: (params) => {
    const { path, value: bundledSize, size: originalSize } = params.data;
    const isModule = typeof originalSize === 'number';

    if (path == null) {
      return '';
    }

    const tooltipContent = [
      isModule ? `<div>Bundled Size: ${bytesToText(bundledSize)}</div>` : null,
      isModule && typeof originalSize === 'number'
        ? `<div>Original Size: ${bytesToText(originalSize)}</div>`
        : null,
      `<div>Path: ${path}</div>`,
    ]
      .filter(isNotNil)
      .join('');

    return `<div>${tooltipContent}</div>`;
  },
  borderColor: 'var(--border)',
};
