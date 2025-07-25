import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { approveTicket, createContainer, createStage } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';
import { Divider, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  // status: zod.string().min(1, { message: 'Please select a status' }),
  containerNumber: zod.string().min(1, { message: 'Container number is required' }),
  capacity: zod.string().min(1, { message: 'Capacity is required' }),
  condition: zod.string().min(1, { message: 'Condition is required' }),
  currentVolume: zod.string().min(1, { message: 'Current volume is required' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  routeId: number;
  cooperativeId?: number; // Optional, adjust as necessary
};

export function NewRouteContainerDialog({ routeId, cooperativeId, open, onClose }: Props) {
  const defaultValues = useMemo(
    () => ({
      containerNumber: '',
      capacity: '',
      condition: 'EXCELLENT',
      routeId,
      currentVolume: '',
      cooperativeId, // Assuming this is needed, adjust as necessary
    }),
    [routeId, cooperativeId]
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

  const onSubmit = handleSubmit(async (data) => {
    const submitData = {
      ...data,
      capacity: Number(data.capacity),
      currentVolume: Number(data.currentVolume),
      routeId,
      cooperativeId, // Include cooperativeId if needed
    };

    try {
      await createContainer(submitData);
      reset();
      toast.success('Container created successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create container');
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add New Container</DialogTitle>
        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            sx={{ mt: 4 }}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
            <Field.Text
              name="containerNumber"
              label="Container Number"
              placeholder="Enter container number"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text name="capacity" label="Capacity" placeholder="Enter capacity" />

            <Field.Text name="currentVolume" label="Current Volume" />

            <Field.Select name="condition" label="Condition">
              <MenuItem
                value=""
                onClick={() => null}
                sx={{ fontStyle: 'italic', color: 'text.secondary' }}
              >
                None
              </MenuItem>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {['EXCELLENT', 'GOOD', 'FAIR', 'POOR'].map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              ))}
            </Field.Select>
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
