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

import { TaskViewDialog } from './task-view-dialog';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellStatus({ params }: ParamsProps) {
  return (
    <Label
      variant="soft"
      color={
        (params.row.isActive && 'success') ||
        (params.row.isActive === false && 'error') ||
        'default'
      }
    >
      {params.row.isActive ? 'ACTIVE' : 'INACTIVE'}
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
  return params.row?.subCounty || 'Not assigned';
}

export function RenderTasks({ params }: ParamsProps) {
  const quickEdit = useBoolean();

  return (
    <Label>
      <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
        <Iconify icon="solar:eye-bold" />
      </IconButton>

      <TaskViewDialog county={params.row} open={quickEdit.value} onClose={quickEdit.onFalse} />
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
      <Label color="success" title="Latitude and Longitude respectively">
        {params.row.name}
      </Label>
    </Stack>
  );
}
