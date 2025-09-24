import type { IPriceConfigTableFilters } from 'src/types/price-config';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<IPriceConfigTableFilters>;
  onResetPage: () => void;
  options: {
    products: string[];
    cooperatives: { id: number; name: string }[];
  };
};

export function PriceConfigTableToolbar({ filters, onResetPage, options }: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterProduct = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (filters.state.productName.includes(value)) {
        filters.setState({
          productName: filters.state.productName.filter((item) => item !== value),
        });
      } else {
        filters.setState({ productName: [...filters.state.productName, value] });
      }
    },
    [filters]
  );

  const handleFilterCooperative = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (filters.state.cooperativeId.includes(value)) {
        filters.setState({
          cooperativeId: filters.state.cooperativeId.filter((item) => item !== value),
        });
      } else {
        filters.setState({ cooperativeId: [...filters.state.cooperativeId, value] });
      }
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <DatePicker
          label="Start date"
          value={filters.state.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="End date"
          value={filters.state.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search price configs..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
