import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime, fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderStatus({ params }: ParamsProps) {
  return (
    <Label
      color={
        params.row.status === 'IN_PROGRESS'
          ? 'info'
          : params.row.status === 'CANCELLED'
            ? 'error'
            : params.row.status === 'COMPLETED'
              ? 'success'
              : 'default'
      }
    >
      {params.row.status}
    </Label>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label color={params.row.taskType === 'MILK_PICK' ? 'success' : 'default'}>
      {params.row.taskType}
    </Label>
  );
}

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
}

export function RenderPriority({ params }: ParamsProps) {
  return (
    <Label
      color={
        params.row.priority === 'LOW'
          ? 'info'
          : params.row.priority === 'HIGH'
            ? 'error'
            : 'default'
      }
    >
      {params.row.priority}
    </Label>
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
            {params.row.title}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {fToNow(params.row.creationDate)} ago
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
