import type { IPriceConfigTableFilters } from 'src/types/price-config';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: UseSetStateReturn<IPriceConfigTableFilters>;
  onResetPage: () => void;
  results: number;
};

export function PriceConfigTableFiltersResult({ filters, onResetPage, results, ...other }: Props) {
  const handleRemoveProduct = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.productName.filter((item) => item !== inputValue);
      filters.setState({ productName: newValue });
      onResetPage();
    },
    [filters, onResetPage]
  );

  const handleRemoveCooperative = useCallback(
    (inputValue: number) => {
      const newValue = filters.state.cooperativeId.filter((item) => item !== inputValue);
      filters.setState({ cooperativeId: newValue });
      onResetPage();
    },
    [filters, onResetPage]
  );

  const handleRemoveDate = useCallback(() => {
    filters.setState({ startDate: null, endDate: null });
    onResetPage();
  }, [filters, onResetPage]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.state.productName.length && (
          <Block label="Product:">
            {filters.state.productName.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveProduct(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.state.cooperativeId.length && (
          <Block label="Cooperative:">
            {filters.state.cooperativeId.map((item) => (
              <Chip
                key={item}
                label={`Coop ${item}`}
                size="small"
                onDelete={() => handleRemoveCooperative(item)}
              />
            ))}
          </Block>
        )}

        {filters.state.startDate && filters.state.endDate && (
          <Block label="Date:">
            <Chip
              size="small"
              label={`${filters.state.startDate?.toLocaleDateString()} - ${filters.state.endDate?.toLocaleDateString()}`}
              onDelete={handleRemoveDate}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={filters.onReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear all
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = {
  label: string;
  children: React.ReactNode;
};

function Block({ label, children }: BlockProps) {
  return (
    <Stack component={Paper} variant="outlined" spacing={1} direction="row" sx={{ p: 1 }}>
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
