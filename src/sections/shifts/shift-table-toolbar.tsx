import type { IProductTableFilters } from 'src/types/product';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IDatePickerControl } from 'src/types/common';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------

export interface Ifilter {
  startDate: any;
  endDate: any;
  stock: string[];
  publish: string[];
}

type Props = {
  filters: UseSetStateReturn<Ifilter>;
  options: {
    stocks: {
      value: string;
      label: string;
    }[];
    publishs: {
      value: string;
      label: string;
    }[];
  };
};

export function CooperativeTableToolbar({ filters, options }: Props) {
  const popover = usePopover();

  const dateError =
    filters.state.startDate && filters.state.endDate
      ? filters.state.startDate > filters.state.endDate
      : false;

  const local = useSetState<Ifilter>({
    stock: filters.state.stock,
    publish: filters.state.publish,
    startDate: filters.state.startDate,
    endDate: filters.state.endDate,
  });

  const handleChangeStock = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ stock: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleChangePublish = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ publish: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleFilterStock = useCallback(() => {
    filters.setState({ stock: local.state.stock });
  }, [filters, local.state.stock]);

  const handleFilterPublish = useCallback(() => {
    filters.setState({ publish: local.state.publish });
  }, [filters, local.state.publish]);

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  return (
    <>
      {/* <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-stock-select-label">Stock</InputLabel>

        <Select
          multiple
          value={local.state.stock}
          onChange={handleChangeStock}
          onClose={handleFilterStock}
          input={<OutlinedInput label="Stock" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-stock-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.stocks.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.stock.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}
          <MenuItem
            onClick={handleFilterStock}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl> */}

      {/* <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-publish-select-label">Publish</InputLabel>
        <Select
          multiple
          value={local.state.publish}
          onChange={handleChangePublish}
          onClose={handleFilterPublish}
          input={<OutlinedInput label="Publish" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-publish-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.publishs.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.publish.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterPublish}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl> */}

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 350 },
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <DatePicker
          label="Start date"
          value={filters.state.endDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="End date"
          value={filters.state.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError ? 'End date must be later than start date' : null,
            },
          }}
          sx={{
            maxWidth: { md: 180 },
            [`& .${formHelperTextClasses.root}`]: {
              bottom: { md: -40 },
              position: { md: 'absolute' },
            },
          }}
        />
      </FormControl>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
