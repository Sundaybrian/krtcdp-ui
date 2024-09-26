import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return params.row.warehouseOwner;
}

export function RenderCellPublish({ params }: ParamsProps) {
  return params.row.depositorName;
}

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
}

export function RenderInsuranceProvidere({ params }: ParamsProps) {
  return <Label>{params.row?.commodityType}</Label>;
}

export function RenderHasInsurance({ params }: ParamsProps) {
  return <Label>{params.row?.receiptNumber}</Label>;
}

export function RenderDate({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
      {fDate(params.row.storageStartDate)} {fTime(params.row.storageStartDate)}
    </Box>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{params.row.warehouseContact}</Box>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return <Stack spacing={0.5}>{params.row?.warehouseLicense}</Stack>;
}

export function RenderCellProduct({
  params,
  onViewRow,
}: ParamsProps & {
  onViewRow: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.warehouseName}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.warehouseContact}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
