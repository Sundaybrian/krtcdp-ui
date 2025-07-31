import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { List, ListItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { approveMilkAggregation, approveTicket } from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  status: zod.string(),
  physicalQuantity: zod.number().optional(),
  finalApprovedQuantity: zod.number().optional(),
  rejectionReason: zod.string().optional(),
  notes: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  data: { item: any; status: string };
};

export function AggregationVerifyDialog({ data, open, onClose }: Props) {
  const defaultValues = useMemo(
    () => ({
      status: data?.status || '',
      physicalQuantity: 0,
      finalApprovedQuantity: 0,
      rejectionReason: '',
      notes: '',
    }),
    [data?.status]
  );

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  console.log(methods.getValues());

  const onSubmit = handleSubmit(async (d) => {
    d.status = data?.status;
    const promise = approveMilkAggregation(data?.item?.id!, d);
    try {
      // onClose();
      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Milk aggregation status updated',
        error: 'Update failed!',
      });

      await promise;
      reset();

      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    console.log(data?.status);

    defaultValues.status = data?.status;
  }, [data?.status, defaultValues]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Verification</DialogTitle>

        <DialogContent>
          <Box gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                {data?.status !== 'REJECTED' && (
                  <>
                    <Field.Text type="number" name="physicalQuantity" label="Physical Quantity" />
                    <Field.Text
                      type="number"
                      name="finalApprovedQuantity"
                      label="Final Approved Quantity"
                    />
                  </>
                )}
                {data?.status === 'REJECTED' && (
                  <Field.Text name="rejectionReason" multiline rows={4} label="Rejection reason" />
                )}

                <Field.Text multiline rows={4} label="Notes" name="notes" />
              </Stack>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
