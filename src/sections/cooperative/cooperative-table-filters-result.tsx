import type { Theme, SxProps } from '@mui/material/styles';
import type { IProductTableFilters } from 'src/types/product';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { sentenceCase } from 'src/utils/change-case';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<any>;
};

export function CooperativeTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveStock = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.name || filters?.state?.lastName || filters?.state?.firstName;
      filters.setState({ stock: newValue });
    },
    [filters]
  );

  const handleRemovePublish = useCallback(
    (inputValue: string) => {
      const newValue = filters?.state?.status;
      filters.setState({ publish: newValue });
    },
    [filters]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Name:" isShow={!!filters.state?.name?.length}>
        ={' '}
        <Chip
          {...chipProps}
          label={filters.state?.name}
          onDelete={() => handleRemoveStock(filters.state?.name)}
        />
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={!!filters.state?.status?.length}>
        <Chip
          {...chipProps}
          label={filters.state?.status}
          onDelete={() => handleRemovePublish(filters.state?.status)}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
