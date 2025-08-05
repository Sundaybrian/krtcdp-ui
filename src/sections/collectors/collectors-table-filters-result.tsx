import type { Theme, SxProps } from '@mui/material/styles';
import type { IProductTableFilters } from 'src/types/product';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { sentenceCase } from 'src/utils/change-case';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { Ifilter } from './collectors-table-toolbar';
import { Filter } from './view/filter-dialog';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<Filter>;
};

export function CooperativeTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveDates = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.endDate;

      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Publish:" isShow={!!filters?.state?.endDate?.length}>
        <Chip
          {...chipProps}
          label={filters?.state?.endDate}
          onDelete={() => handleRemoveDates(filters?.state?.endDate)}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
