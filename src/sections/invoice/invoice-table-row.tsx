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

// ----------------------------------------------------------------------

type Props = {
  row: InvoiceItem;
  selected: boolean;
  onViewRow: () => void;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function InvoiceTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
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
            <Avatar alt={row.farmer.firstName}>
              {row.farmer.firstName.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.farmer.firstName} {row.farmer.lastName}
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
            primary={fDate(row.creationDate)}
            secondary={fTime(row.creationDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.dueDate)}
            secondary={fTime(row.dueDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.amountDue)}</TableCell>

        <TableCell align="center">{fCurrency(row.amountPaid)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'PAID' && 'success') ||
              (row.status === 'PENDIND' && 'warning') ||
              (row.status === 'LATE' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
