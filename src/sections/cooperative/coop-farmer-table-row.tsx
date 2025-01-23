import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return params.row.maritalStatus;
}

export function RenderCellPublish({ params }: ParamsProps) {
  return params.row.residence;
}

export function RenderCoop({ params }: ParamsProps) {
  return params.row?.cooperative?.groupName || 'No Cooperative';
}

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
}

export function RenderInsuranceProvidere({ params }: ParamsProps) {
  return <Label>{params.row?.Farmer?.insuranceProvider}</Label>;
}

export function RenderHasInsurance({ params }: ParamsProps) {
  return <Label>{params.row?.Farmer?.hasInsurance ? 'YES' : 'NO'}</Label>;
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{params.row.mobilePhone}</Box>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={100}
        variant="determinate"
        color={
          (params.row?.Farmer?.insuranceType === 'out of stock' && 'error') ||
          (params.row?.Farmer?.insuranceType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {params.row?.Farmer?.insuranceType}
    </Stack>
  );
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
            {params.row.firstName} {params.row.lastName}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.email}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
