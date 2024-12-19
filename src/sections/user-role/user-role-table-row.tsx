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
  return <Label>{params.row.totalCooperatives || 0}</Label>;
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label color={params.row.role.status ? 'success' : 'default'}>
      {params.row?.role.status ? 'Active' : 'Inactive'}
    </Label>
  );
}

export function RenderGeneric({ params }: ParamsProps) {
  return params.row[params.field];
}

export function RenderRoleType({ params }: ParamsProps) {
  return <Label>{params?.row?.user?.username}</Label>;
}

export function RenderCreatedAt({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
      {fDate(params.row.createdAt)}
      {fTime(params.row.createdAt)}
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
            {params?.row.role?.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            <Label>{params.row?.role?.isSuperadmin ? 'Super admin' : '--'}</Label>
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
