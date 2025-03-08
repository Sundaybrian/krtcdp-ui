import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime, fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return <Label>{params.row.totalCooperatives || 0}</Label>;
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label color={params.row.isRead ? 'success' : 'default'}>
      {params.row.isRead ? 'YES' : 'NO'}
    </Label>
  );
}

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
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
          <Typography noWrap color="inherit" variant="subtitle2" sx={{ cursor: 'pointer' }}>
            {params.row.title}
          </Typography>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {fToNow(params.row.creationDate)}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
