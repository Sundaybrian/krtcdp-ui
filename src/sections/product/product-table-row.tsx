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
  return fCurrency(params.row.price);
}

export function RenderCellMarketPrice({ params }: ParamsProps) {
  return fCurrency(params.row.marketPrice);
}

export function RenderCellCategory({ params }: ParamsProps) {
  return params.row.category;
}

export function RenderProductCategory({ params }: ParamsProps) {
  return params.row?.Category?.categoryName;
}

export function RenderProductSubCategory({ params }: ParamsProps) {
  return params.row?.SubCategory?.subcategoryName;
}

export function RenderCellCooperative({ params }: ParamsProps) {
  return params.row.cooperative.groupName;
}

export function RenderCellCode({ params }: ParamsProps) {
  return (
    <Label
      variant="soft"
      color={
        (params.row.status === 'DRAFT' && 'info') ||
        (params.row.status === 'PUBLISHED' && 'success') ||
        'default'
      }
    >
      {params.row.status}
    </Label>
  );
}

export function RenderCellTags({ params }: ParamsProps) {
  return params.row?.tags.map((tag: string) => (
    <Label key={tag} variant="filled" color="default" sx={{ textTransform: 'capitalize' }}>
      {tag}
    </Label>
  ));
}

export function RenderCellSaleDate({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.saleStartDate)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.saleStartDate)}
      </Box>
    </Stack>
  );
}

export function RenderCellSaleEndDate({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.saleEndDate)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.saleEndDate)}
      </Box>
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.stockQuantity * 100) / params.row.minStockLevel}
        variant="determinate"
        color={
          (params.row.minStockLevel === 0 && 'error') ||
          (params.row.minStockLevel < 10 && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {(!!params.row.stockQuantity && params.row.stockQuantity) || 0} {params.row.unit}
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
      <Avatar
        alt={params.row.name}
        src={params.row?.thumbnail}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

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
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
