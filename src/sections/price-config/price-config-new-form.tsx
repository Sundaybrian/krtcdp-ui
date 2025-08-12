import type { IPriceConfig } from 'src/types/price-config';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { createPriceConfig } from 'src/api/services';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

// ----------------------------------------------------------------------

export type NewPriceConfigSchemaType = zod.infer<typeof NewPriceConfigSchema>;

export const NewPriceConfigSchema = zod.object({
  productName: zod.string().min(1, { message: 'Product name is required!' }),
  price: zod.number().min(0, { message: 'Price must be a positive number!' }),
  effectiveDate: zod.string().min(1, { message: 'Effective date is required!' }),
  cooperativeId: zod.number(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPriceConfig?: IPriceConfig;
};

export function PriceConfigNewEditForm({ currentPriceConfig }: Props) {
  const router = useRouter();

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  console.log(state.coopId, 'state.coopId');

  const defaultValues = useMemo(
    () => ({
      productName: currentPriceConfig?.productName || '',
      price: currentPriceConfig?.price || 0,
      effectiveDate: currentPriceConfig?.effectiveDate || '',
      cooperativeId: state.coopId ? Number(state.coopId) : 0,
    }),
    [currentPriceConfig, state.coopId]
  );

  const methods = useForm<NewPriceConfigSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPriceConfigSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // TODO: Implement API call to create/update price config
      console.log('Price config data:', data);
      data.cooperativeId = state.coopId ? Number(state.coopId) : 0;
      await createPriceConfig(data);
      reset();
      toast.success(currentPriceConfig ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.priceConfig.root);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={
            currentPriceConfig ? 'Edit Price Configuration' : 'Create a new price configuration'
          }
          subheader="Configure product pricing for cooperatives"
          sx={{ mb: 3 }}
        />

        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
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

            {/* <Field.Text name="cooperativeId" label="Cooperative ID" type="number" /> */}
          </Box>
        </Stack>

        <Divider />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 3 }}>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.priceConfig.root)}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentPriceConfig ? 'Save Changes' : 'Create Price Config'}
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
