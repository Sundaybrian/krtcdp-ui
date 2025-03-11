import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <Label
      variant="soft"
      color={
        (params.row.status === 'New' && 'info') ||
        (params.row.status === 'PUBLISHED' && 'success') ||
        'default'
      }
    >
      {params.row.status}
    </Label>
  );
}

export function RenderCellLocation({ params }: ParamsProps) {
  return (
    <Label color="success" title="Latitude and Longitude respectively">
      {params.row.latitude} : {params.row.longitude}
    </Label>
  );
}

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
}

export function RenderAgent({ params }: ParamsProps) {
  return params.row?.agent?.firstNameType || 'Not assigned';
}

export function RenderHasInsurance({ params }: ParamsProps) {
  return <Label>{params.row.hasInsurance ? 'YES' : 'NO'}</Label>;
}

export function RenderCreatedAt({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
      {fDate(params.row.creationDate)}
      {fTime(params.row.creationDate)}
    </Box>
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
          <Label color="success" title="Latitude and Longitude respectively">
            {params.row.locationName}
          </Label>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {`${params.row.firstName || 'User'} ${params.row.lastName || 'Not recorded'} `}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
