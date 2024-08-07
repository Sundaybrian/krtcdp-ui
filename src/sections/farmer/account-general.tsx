import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useMockedUser } from 'src/auth/hooks';
import { CoopFarmerList, IUserItem } from 'src/types/user';
import { MARITAL_STATUS_OPTIONS } from 'src/utils/default';
import { Divider, MenuItem } from '@mui/material';
import { approveCoopFarmer, approveLeaveCoop, rejectCoopFarmer } from 'src/api/services';

// ----------------------------------------------------------------------

type Props = {
  farmer: CoopFarmerList;
  coopId: number;
};
export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  middleName: zod.string().min(1, { message: 'Middle name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(8, { message: 'Password must be at least 6 characters!' }),
  mobilePhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  birthDate: zod.string().min(1, { message: 'DOB is required!' }),
  ward: zod.string().min(1, { message: 'Ward is required!' }),
  residence: zod.string().min(1, { message: 'Residence is required!' }),
  county: zod.string().min(1, { message: 'County is required!' }),
  maritalStatus: zod.string().min(1, { message: 'Marital Status is required!' }),
  subCounty: zod.string().min(1, { message: 'Sub county is required!' }),
  kraPin: zod.string().min(1, { message: 'KRA PIN is required!' }),
  // Not required
  acceptTerms: zod.boolean(),
  isAdministrator: zod.boolean(),
  userState: zod.string(),
  isSupport: zod.boolean(),
  userType: zod.string(),
  hasInsurance: zod.boolean(),
  insuranceProvider: zod.string(),
  insuranceType: zod.string(),
});

export function FarmerAccountGeneral({ farmer, coopId }: Props) {
  console.log(farmer, 'Farmer');

  const defaultValues = {
    email: farmer?.email || '',
    mobilePhone: farmer.mobilePhone || '',
    firstName: farmer.firstName || '',
    lastName: farmer.lastName || '',
    middleName: farmer.middleName || '',
    userType: farmer.userType || 'FARMER',
    birthDate: farmer.birthDate || '',
    maritalStatus: farmer?.Farmer?.maritalStatus || 'single',
    kraPin: farmer.kraPin || '',
    residence: farmer.residence || '',
    ward: farmer.ward || '',
    hasInsurance: farmer?.Farmer?.hasInsurance || false,
    insuranceProvider: farmer?.Farmer?.insuranceProvider || '',
    insuranceType: farmer?.Farmer?.insuranceType || '',
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const approveJoin = async (e: any) => {
    console.log(e);
    if (e.target.checked) {
      const promise = approveCoopFarmer(coopId, farmer.id);
      try {
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Farmer approved successfully!',
          error: 'An error occured while performing this action',
        });

        await promise;
      } catch (error) {
        console.error(error);
      }
    }
  };

  // rejectCoopFarmer
  const rejectJoin = async (e: any) => {
    console.log(e);
    if (e.target.checked) {
      const promise = rejectCoopFarmer(coopId, farmer.id);
      try {
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Farmer join request dissaproved successfully!',
          error: 'An error occured while performing this action',
        });

        await promise;
      } catch (error) {
        console.error(error);
      }
    }
  };

  // aprove leave coop
  const approveLeave = async (e: any) => {
    if (e.target.checked) {
      const promise = approveLeaveCoop(coopId, farmer.id);
      try {
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Farmer leave request approved successfully!',
          error: 'An error occured while performing this action',
        });

        await promise;
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Field.Switch
              name="approveJoin"
              labelPlacement="start"
              label="Approve Join"
              checked={farmer?.status[0].status === 'ACTIVE'}
              onClick={approveJoin}
              sx={{ mt: 5 }}
            />

            {farmer.status[0].status === 'PENDINGAPPROVAL' && (
              <Field.Switch
                name="rejectJoin"
                labelPlacement="start"
                label="Reject Join"
                onClick={rejectJoin}
                sx={{ mt: 1 }}
              />
            )}

            {farmer.status[0].status === 'PENDINGEXITAPPROVAL' && (
              <Field.Switch
                name="approveLeave"
                labelPlacement="start"
                label="Approve Leave"
                onClick={approveLeave}
                sx={{ mt: 1 }}
              />
            )}

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Deactivate Farmer
            </Button>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Text
                  name="firstName"
                  label="First name"
                  InputLabelProps={{ shrink: true }}
                />

                <Field.Text name="middleName" label="Middle name" />
              </Stack>

              <Field.Text name="lastName" label="Last name" InputLabelProps={{ shrink: true }} />

              <Field.Text name="email" label="Email address" />

              <Field.Phone disabled name="mobilePhone" country="KE" label="Phone number" />

              <Field.DatePicker name="birthDate" label="DOB" />

              <Field.Select name="maritalStatus" label="Marital status">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {MARITAL_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status} onClick={() => null}>
                    {status}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="kraPin" label="KRA PIN" />

              <Field.Text name="residence" label="Residence" />

              <Field.Text name="ward" label="Ward" />

              <Field.Checkbox name="hasInhasInsurancesurance" label="Insured" />
              <Field.Text name="insuranceProvider" label="Insurance provider" />
              <Field.Text name="insuranceType" label="Insurance Type" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
