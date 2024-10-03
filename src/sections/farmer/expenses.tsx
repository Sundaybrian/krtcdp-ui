import type { Expense, Partition } from 'src/types/farm';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { createFarmExpense } from 'src/api/services';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  activityProcess: zod.string(),
  target: zod.string().min(1, 'Target is required'),
  activityType: zod.string().min(1, 'Activity type is required'),
  imageUrl: zod.any(),
  partitionId: zod.number(),
  expenseAmount: zod.string().min(1, 'Amount is required'),
  notes: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  farmId: number;
  expenses: Expense[];
  list: Partition[];
};

export function ExpenseListDialog({
  list,
  open,
  expenses,
  farmId,
  onClose,
  title = 'Expenses',
}: Props) {
  const [searchAddress, setSearchAddress] = useState('');
  const [openForm, setOpenForm] = useState(false);

  console.log(expenses);

  const dataFiltered = applyFilter({ inputData: expenses, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const defaultValues = useMemo(
    () => ({
      activityProcess: '',
      target: '',
      activityType: '',
      imageUrl: '',
      partitionId: 0,
      expenseAmount: '',
      notes: '',
    }),
    []
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSearchAddress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    data.expenseAmount = Number(data.expenseAmount) as any;
    try {
      await createFarmExpense(farmId, data);
      reset();
      toast.success('Expense created');
      // router.push(paths.dashboard.user.list);
    } catch (error) {
      toast.error(error.message || 'Failed to create expense');
    }
  });

  const renderList = (
    <Scrollbar sx={{ p: 0.5, maxHeight: 480 }}>
      {dataFiltered.map((expense) => (
        <ButtonBase
          key={expense.id}
          sx={{
            py: 1,
            my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Label color="info">Activity</Label>

            <Typography variant="subtitle2">{expense.activityType}</Typography>
          </Stack>

          {expense.creationDate && (
            <Box sx={{ color: 'primary.main', typography: 'caption' }}>
              <Label color="primary">Date: </Label>
              {fDateTime(expense.creationDate)}
            </Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <Label color="primary">Amount: </Label>

            {fCurrency(expense.expenseAmount)}
          </Typography>

          {expense.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {expense.notes}
            </Typography>
          )}
        </ButtonBase>
      ))}
    </Scrollbar>
  );

  const renderForm = (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Field.Select name="activityProcess" label="Acitivity">
          <MenuItem
            value=""
            onClick={() => null}
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {['INPUT'].map((union) => (
            <MenuItem key={union} value={union} onClick={() => {}}>
              {union}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Select name="target" label="Target">
          <MenuItem
            value=""
            onClick={() => null}
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {['CROP', 'MILK', 'OTHER'].map((union) => (
            <MenuItem key={union} value={union} onClick={() => {}}>
              {union}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Select name="partitionId" label="Partition">
          <MenuItem
            value=""
            onClick={() => null}
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {list.map((partition) => (
            <MenuItem key={partition.id + partition.farmId} value={partition.id} onClick={() => {}}>
              {partition.valueChainType} -- {partition.valueChainName}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text label="Activity Type" name="activityType" InputLabelProps={{ shrink: true }} />

        <Field.Text name="expenseAmount" label="Amount" InputLabelProps={{ shrink: true }} />

        <Field.Text multiline name="notes" label="Notes" InputLabelProps={{ shrink: true }} />

        <DialogActions>
          <Button variant="outlined" color="error" onClick={(e) => setOpenForm(false)}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </DialogActions>
      </Stack>
    </Form>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>
        <Box>
          <Button sx={{ mr: 1 }} variant="outlined" size="small" color="error" onClick={onClose}>
            Exit
          </Button>
          <Button
            size="small"
            onClick={(e) => setOpenForm(true)}
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: 'flex-end' }}
          >
            New
          </Button>
        </Box>
      </Stack>
      {openForm && <>{renderForm}</>}

      {!openForm && (
        <>
          <Stack sx={{ p: 2, pt: 0 }}>
            <TextField
              value={searchAddress}
              onChange={handleSearchAddress}
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {notFound ? (
            <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
          ) : (
            renderList
          )}
        </>
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: Expense[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    return inputData.filter(
      (address) =>
        address.activityProcess.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.activityType.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        `${address.target}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
