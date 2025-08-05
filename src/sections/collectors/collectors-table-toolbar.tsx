import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { useSetState } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export interface Ifilter {
  startDate: any;
  endDate: any;
}

type Props = {
  filters: UseSetStateReturn<Ifilter>;
};

export function CooperativeTableToolbar({ filters }: Props) {
  const popover = usePopover();

  const dateError =
    filters.state.startDate && filters.state.endDate
      ? filters.state.startDate > filters.state.endDate
      : false;

  const local = useSetState<Ifilter>({
    startDate: filters.state.startDate,
    endDate: filters.state.endDate,
  });

  const handleChangeStartDate = useCallback(
    (newValue: any) => {
      const date = newValue ? new Date(newValue) : null;
      local.setState({ startDate: date });
      filters.setState({ startDate: date });
    },
    [local, filters]
  );

  const handleChangeEndDate = useCallback(
    (newValue: any) => {
      const date = newValue ? new Date(newValue) : null;
      local.setState({ endDate: date });
      filters.setState({ endDate: date });
    },
    [local, filters]
  );

  return (
    <>
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
          value={local.state.startDate}
          onChange={handleChangeStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="End date"
          value={local.state.endDate}
          onChange={handleChangeEndDate}
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
