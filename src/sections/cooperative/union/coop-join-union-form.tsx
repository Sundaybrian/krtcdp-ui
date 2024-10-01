import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { coopJoinUnion } from 'src/api/services';
import { useSearchCooperativeUnions } from 'src/actions/cooperative';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  unionId: zod.number({ message: 'Union is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  coopId?: number;
  open: boolean;
  onClose: () => void;
};

export function CoopJoinUnionForm({ coopId, open, onClose }: Props) {
  const unionData = useSearchCooperativeUnions();

  const defaultValues = useMemo(
    () => ({
      unionId: 0,
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (coopId) {
        await coopJoinUnion(data.unionId, { cooperativeId: coopId });
      }
      reset();
      toast.success("You've successfully joined the union");
      // router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
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
        <DialogTitle>Join Cooperative Union</DialogTitle>
        <Card sx={{ p: 3 }}>
          <DialogContent>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Select name="unionId" label="Cooperative Union">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {unionData.searchResults.map((union) => (
                  <MenuItem key={union.name + union.id} value={union.id} onClick={() => {}}>
                    {union.name}--{union.location}
                  </MenuItem>
                ))}
              </Field.Select>{' '}
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Join
            </LoadingButton>
          </DialogActions>
        </Card>
      </Form>
    </Dialog>
  );
}
