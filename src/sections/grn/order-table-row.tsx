import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { IOrderItem } from 'src/types/order';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Grn } from 'src/types/farm';
import { Form, Field } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

type Props = {
  row: Grn;
  selected: boolean;
  onViewRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onApproveRow: (data: { amount: any; terms: string }) => any;
};

// ----------------------------------------------------------------------
export type PurchaseOrderSchema = zod.infer<typeof OrderSchema>;

export const OrderSchema = zod.object({
  amount: zod.string().min(1, { message: 'Amount is required' }),
  terms: zod.string(),
});
// ----------------------------------------------------------------------

export function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onApproveRow,
}: Props) {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const defaultValues = {
    amount: '',
    terms: '',
  };

  const methods = useForm<PurchaseOrderSchema>({
    resolver: zodResolver(OrderSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const values = watch();

  const handleSubmitPurchaseOrder = () => {
    if (!values.amount) {
      toast.error('Amount is required');
    }

    confirm.onFalse();

    onApproveRow(values);
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {row.id}
        </Link>
      </TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          {/* <Avatar alt={row.farmerId} src={row.farmerId} /> */}

          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span">
              {row.farmer.firstName} {row.farmer.lastName}
            </Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.farmer.mobilePhone}
            </Box>
          </Stack>
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

      <TableCell align="center"> {row.approvedQuantity} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'APPROVED' && 'success') ||
            (row.status === 'PENDINGCONFIRMATION' && 'warning') ||
            (row.status === 'REJECTED' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {/* {renderSecondary} */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="solar:check-square-bold" />
            Approve
          </MenuItem>

          {/* <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="solar:check-square-bold" />
            Approve
          </MenuItem> */}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Purchase Order"
        content={
          <>
            <Form methods={methods}>
              <Stack spacing={1.5}>
                <Field.Text name="amount" placeholder="Price" label="Price" />
                <Field.Text name="terms" label="Comment" />
              </Stack>
            </Form>
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={handleSubmitPurchaseOrder}>
            Submit
          </Button>
        }
      />
    </>
  );
}
