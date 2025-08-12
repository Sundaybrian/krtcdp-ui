import type { IPriceConfig } from 'src/types/price-config';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type PriceConfigQuickEditSchemaType = zod.infer<typeof PriceConfigQuickEditSchema>;

export const PriceConfigQuickEditSchema = zod.object({
  productName: zod.string().min(1, { message: 'Product name is required!' }),
  price: zod.number().min(0, { message: 'Price must be a positive number!' }),
  effectiveDate: zod.string().min(1, { message: 'Effective date is required!' }),
  cooperativeId: zod.number(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IPriceConfig;
};

export function PriceConfigQuickEditForm({ currentUser, open, onClose }: Props) {
  const defaultValues = useMemo(
    () => ({
      productName: currentUser?.productName || '',
      price: currentUser?.price || 0,
      effectiveDate: currentUser?.effectiveDate || '',
      cooperativeId: currentUser?.cooperativeId || 0,
    }),
    [currentUser]
  );

  const methods = useForm<PriceConfigQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(PriceConfigQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // TODO: Implement API call to update price config
      console.log('Price config data:', data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
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
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Update price configuration details
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="productName" label="Product Name" />

            <Field.Text
              name="price"
              label="Price"
              type="number"
              InputProps={{
                startAdornment: 'KES ',
              }}
            />

            <Field.DatePicker name="effectiveDate" label="Effective Date" />

            {/* <Field.Text 
              name="cooperativeId" 
              label="Cooperative ID" 
              type="number"
            /> */}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
