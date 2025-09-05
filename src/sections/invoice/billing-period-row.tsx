import type { IInvoice, InvoiceItem } from 'src/types/invoice';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IBillingPeriod } from 'src/api/data.inteface';
import { generateInvoice } from 'src/api/services';
import { toast } from 'src/components/snackbar';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: IBillingPeriod;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function BillingPeriodTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleGenerateInvoice = async () => {
    const promise = generateInvoice(row.id);

    try {
      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Invoice generated successfully',
        error: 'Failed to generate invoice',
      });

      await promise;
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.periodName}>{row.periodName.charAt(0).toUpperCase()}</Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {row.periodName}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {row.id}
              </Link>
            }
          />
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.startDate)}
          secondary={fTime(row.startDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.endDate)}
          secondary={fTime(row.endDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:file-text-outline" />}
          sx={{ mr: '8px' }}
          onClick={handleGenerateInvoice}
        >
          Generate Invoice
        </Button>
      </TableCell>
    </TableRow>
  );
}
