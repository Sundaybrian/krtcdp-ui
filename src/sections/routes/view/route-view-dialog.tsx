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

import { approveTicket, createStage } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  // status: zod.string().min(1, { message: 'Please select a status' }),
  name: zod.string().min(1, 'Name is required'),
  description: zod.string().optional(),
  sequence: zod.any().optional(),
  routeId: zod.any().optional(),
  estimatedDistance: zod.string().optional(),
  longitude: zod.string().optional(),
  latitude: zod.string().optional(),
  estimatedDuration: zod.string().optional(),
  areaBoundaries: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  routeId: number;
};

export function NewStageDialog({ routeId, open, onClose }: Props) {
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      sequence: '',
      routeId: routeId,
      estimatedDistance: '',
      longitude: '',
      latitude: '',
      estimatedDuration: '',
      areaBoundaries: '',
    }),
    [routeId]
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
      estimatedDistance: Number(data.estimatedDistance),
      estimatedDuration: Number(data.estimatedDuration),
      sequence: Number(data.sequence),
      routeId: routeId,
    };

    try {
      await createStage(submitData);
      reset();
      toast.success('Stage created successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create stage');
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
        <DialogTitle>Add Stage</DialogTitle>
        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            sx={{ mt: 4 }}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
            <Field.Text
              name="name"
              label="Stage Name"
              placeholder="Enter stage name"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text name="sequence" label="Sequence" placeholder="Enter sequence" />

            <Field.Text multiline rows={4} name="description" label="Description" />

            <Field.Text
              name="estimatedDistance"
              label="Estimated Distance (km)"
              placeholder="Enter estimated distance"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text
              name="estimatedDuration"
              label="Estimated Duration (minutes)"
              placeholder="Enter estimated duration"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text
              name="longitude"
              label="Longitude"
              placeholder="Enter longitude"
              InputLabelProps={{ shrink: true }}
            />

            <Field.Text
              name="latitude"
              label="Latitude"
              placeholder="Enter latitude"
              InputLabelProps={{ shrink: true }}
            />
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
