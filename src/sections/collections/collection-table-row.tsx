import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import { fDate, fTime } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';

import { Label } from 'src/components/label';
import { Badge } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';

import { TaskViewDialog } from './collection-view-dialog';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <Label
      variant="soft"
      color={
        (params.row.status === 'COLLECTED' && 'success') ||
        (params.row.status === 'PENDING' && 'info') ||
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

export function RenderRoute({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <ListItemText primary={params.row.route.name} />
    </Stack>
  );
}

export function RenderAgent({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <ListItemText
        primary={params?.row?.container?.containerNumber}
        secondary={
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            {params.row?.container?.capacity}
          </Box>
        }
      />
    </Stack>
  );
}

export function RenderTasks({ params }: ParamsProps) {
  return (
    <Box>
      {params.row?.farmer?.firstName} {params.row?.farmer?.lastName}
    </Box>
  );
}

export function RenderCreatedAt({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
      {fDate(params.row.creationDate)}
      {fTime(params.row.creationDate)}
    </Box>
  );
}

export function RenderCollectionTime({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
      {fDate(params.row.collectionTime)}
      {fTime(params.row.collectionTime)}
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
      <Box color="success" title="Collector Name">
        {params.row?.collector?.firstName} {params.row?.collector?.lastName}
      </Box>
    </Stack>
  );
}
