import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { QUALITY_GRADE, UNIT_OF_MEASUREMENT, TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { createWarehouseReceipt } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  receiptNumber: zod.any(),
  depositorName: zod.string(),
  depositorContact: zod.string(),
  depositorType: zod.string(),
  warehouseName: zod.string(),
  warehouseLocation: zod.string(),
  warehouseLicense: zod.string(),
  warehouseContact: zod.string(),
  warehouseOwner: zod.string(),
  commodityType: zod.string(),
  quantity: zod.any(),
  unitOfMeasurement: zod.string(),
  qualityGrade: zod.string(),
  storageStartDate: zod.string(),
  expectedStorageDuration: zod.any(),
  storageLocation: zod.string(),
  conditionAtReceipt: zod.string(),
  handlingInstructions: zod.string(),
  storageRate: zod.any(),
  paymentTerms: zod.string(),
  insuranceInfo: zod.string(),
  depositorSignature: zod.boolean(),
  warehouseSignature: zod.boolean(),
  termsAndConditions: zod.string(),
  remarks: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function WarehouseNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const defaultValues = useMemo(
    () => ({
      receiptNumber: '',
      depositorName: '',
      depositorContact: '',
      depositorType: 'FARMER',
      warehouseName: '',
      warehouseLocation: '',
      warehouseLicense: '',
      warehouseContact: '',
      warehouseOwner: '',
      commodityType: '',
      quantity: 0,
      unitOfMeasurement: '',
      qualityGrade: '',
      storageStartDate: '',
      expectedStorageDuration: 0,
      storageLocation: '',
      conditionAtReceipt: '',
      handlingInstructions: '',
      storageRate: 0,
      paymentTerms: '',
      insuranceInfo: '',
      depositorSignature: true,
      warehouseSignature: true,
      termsAndConditions: '',
      remarks: '',
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
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    // make the following numbers
    data.quantity = Number(data.quantity);
    data.expectedStorageDuration = Number(data.expectedStorageDuration);
    data.storageRate = Number(data.storageRate);

    // date to iso
    data.storageStartDate = new Date(data.storageStartDate).toISOString();

    console.log('DATA', data);
    try {
      await createWarehouseReceipt(data);
      reset();
      toast.success(currentUser ? 'Update success!' : 'New record created successfully!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to create new record');
    }
  });

  // use effect
  useEffect(() => {}, []);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
          >
            <Field.Text name="warehouseName" label="Warehouse Name" />
            <Field.Text name="warehouseLocation" label="Warehouse Location" />
            <Field.Phone country="KE" name="warehouseContact" label="Warehouse Contact" />

            <Field.Text name="warehouseLicense" label="Warehouse License" />
            <Field.Text name="warehouseOwner" label="Warehouse Owner" />
            <Field.Checkbox name="warehouseSignature" label="Warehouse Signature" />

            <Field.Text name="depositorName" label="Depositor Name" />
            <Field.Phone country="KE" name="depositorContact" label="Depositor Contact" />
            <Field.Checkbox name="depositorSignature" label="Depositor Signature" />
            <Field.Text name="depositorType" label="Depositor Type" />

            <Field.Text name="receiptNumber" label="Receipt Number" />
            <Field.Text name="conditionAtReceipt" label="Condition At Receipt" />

            <Field.Text name="commodityType" label="Commodity Type" />
            <Field.Text name="quantity" label="Quantity" />
            <Field.Select name="unitOfMeasurement" label="Unit Of Measurement">
              <MenuItem
                value=""
                onClick={() => null}
                sx={{ fontStyle: 'italic', color: 'text.secondary' }}
              >
                None
              </MenuItem>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {UNIT_OF_MEASUREMENT.map((status) => (
                <MenuItem key={status} value={status} onClick={() => null}>
                  {status}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Select name="qualityGrade" label="Quality Grade">
              <MenuItem
                value=""
                onClick={() => null}
                sx={{ fontStyle: 'italic', color: 'text.secondary' }}
              >
                None
              </MenuItem>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {QUALITY_GRADE.map((status) => (
                <MenuItem key={status} value={status} onClick={() => null}>
                  {status}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.DatePicker name="storageStartDate" label="Storage Start Date" />
            <Field.Text name="expectedStorageDuration" label="Expected Storage Duration" />
            <Field.Text name="storageLocation" label="Storage Location" />
            <Field.Text name="handlingInstructions" label="Handling Instructions" />
            <Field.Text name="storageRate" label="Storage Rate" />
            <Field.Text name="paymentTerms" label="Payment Terms" />
            <Field.Text name="insuranceInfo" label="Insurance Info" />
            <Field.Text name="termsAndConditions" label="Terms And Conditions" />
            <Field.Text name="remarks" label="Remarks" />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentUser ? 'Submit' : 'Save changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
