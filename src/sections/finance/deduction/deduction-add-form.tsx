import type { FamerBalace } from 'src/types/transaction';

import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useSearchAdmins } from 'src/actions/user';
import { searchFarmerBalance, createCheckOffDeduction } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  farmer: zod.any({ message: 'farmer is required!' }),
  transactionType: zod.string({ message: 'Transaction type is required!' }),
  amount: zod.string().min(1, { message: 'Amount is required!' }),
  commodity: zod.string({ message: 'Commodity is required!' }),
  narration: zod.string({ message: 'Narration is required!' }),
  cooperativeId: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  coopId?: number;
  open: boolean;
  onClose: () => void;
};

export function DeductionCreateForm({ coopId, open, onClose }: Props) {
  const farmerData = useSearchAdmins({ userType: 'FARMER', coopId });
  const [farmerBalance, setFarmerBalance] = useState<FamerBalace>({
    id: 0,
    cooperativeId: 0,
    totalOwed: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    overDraft: 0,
  });

  const defaultValues = useMemo(
    () => ({
      userId: '',
      farmer: '',
      cooperativeId: coopId,
      transactionType: '',
      amount: '',
      commodity: '',
      narration: '',
      farmerBalanceId: '',
    }),
    [coopId]
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const checkOffData = {
        userId: data.farmer.id,
        transactionType: data.transactionType,
        amount: Number.parseFloat(data.amount),
        commodity: data.commodity,
        narration: data.narration,
        farmerBalanceId: farmerBalance.id,
        cooperativeId: coopId,
      };

      await createCheckOffDeduction(checkOffData);
      reset();
      toast.success('Deduction added successfully');
      // router.push(paths.dashboard.user.list);
    } catch (error) {
      toast.error('Failed to add deduction');
      console.error(error);
    }
  });

  const handleOnChangeFarmer = (email: string) => {
    const farmer = farmerData.userResults.find((user) => user.email === email);
    if (!farmer) {
      return;
    }
    // get farmer balance
    searchFarmerBalance({ farmerId: farmer.id })
      .then((response) => {
        const balance = response.results.find((bal) => bal.farmerId === farmer.id);
        setFarmerBalance(balance!);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add deduction</DialogTitle>
        <Card sx={{ p: 3 }}>
          <DialogContent>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Autocomplete
                name="farmer"
                label="Farmer"
                placeholder="Select Farmer"
                multiple={false}
                freeSolo
                disableCloseOnSelect
                options={farmerData.userResults.map((user) => user)}
                getOptionLabel={(option) => option?.email || ''}
                onInputChange={(event, newValue) => handleOnChangeFarmer(newValue)}
                renderOption={(props, option) => (
                  <li {...props} key={option.email}>
                    {option?.firstName}--{option?.email}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.email}
                      label={option.email}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
              <Field.Select name="transactionType" label="Transaction Type">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {['LOAN', 'DEDUCTION', 'ADVANCE'].map((type) => (
                  <MenuItem key={type} value={type} onClick={() => {}}>
                    {type}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="amount" label="Amount" />
              <Field.Text name="commodity" label="Commodity" />
              <Field.Text name="narration" label="Narration" />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </DialogActions>
        </Card>
      </Form>
    </Dialog>
  );
}
