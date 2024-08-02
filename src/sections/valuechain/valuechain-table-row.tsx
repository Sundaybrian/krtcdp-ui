import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

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

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
}

export function RenderInsuranceProvidere({ params }: ParamsProps) {
  return <Label>{params.row?.Farmer?.insuranceProvider}</Label>;
}

export function RenderCellUpdatedAt({ params }: ParamsProps) {
  return <Label>{fDate(params.row.lastModifiedDate)}</Label>;
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.creationDate)}</Box>
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
            {params.row.name}
          </Link>
        }
        secondary={<Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }} />}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
