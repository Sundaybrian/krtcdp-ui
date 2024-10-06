import type { Stakeholder } from 'src/types/user';
import type { County, SubCounty } from 'src/api/data.inteface';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { VALUE_CHAIN_TYPES, MARITAL_STATUS_OPTIONS } from 'src/utils/default';

import {
  getCounties,
  createFarmer,
  createStakeholder,
  getStakeholderTypes,
} from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  maritalStatus: zod.string().min(1, { message: 'Marital Status is required!' }),
  businessName: zod.string().min(1, { message: 'Business name is required!' }),
  mobilePhone: zod.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  yearOfRegistration: zod.string().min(1, { message: 'YOR is required!' }),
  kraPin: zod.string().min(1, { message: 'KRA PIN is required!' }),
  ward: zod.string().min(1, { message: 'Ward is required!' }),
  residence: zod.string().min(1, { message: 'Residence is required!' }),
  county: zod.string().min(1, { message: 'County is required!' }),
  subCounty: zod.string().min(1, { message: 'Sub county is required!' }),
  type: zod.string().min(1, { message: 'Type is required!' }),
  // Not required
  insuranceProvider: zod.string(),
  insuranceType: zod.string(),
  hasInsurance: zod.boolean(),
  valueChainType: zod.string().min(1, { message: 'Value chain type is required!' }),
  memberNumber: zod.string().min(1, { message: 'Member number is required!' }),
});

const FarmerSchema = zod.object({
  maritalStatus: zod.string().min(1, { message: 'Marital Status is required!' }),
  insuranceProvider: zod.string(),
  insuranceType: zod.string(),
  hasInsurance: zod.boolean(),
  memberNumber: zod.string().min(1, { message: 'Member number is required!' }),
});

const NonFarmerSchema = zod.object({
  businessName: zod.string().min(1, { message: 'Business name is required!' }),
  mobilePhone: zod.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  yearOfRegistration: zod.string().min(1, { message: 'YOR is required!' }),
  kraPin: zod.string().min(1, { message: 'KRA PIN is required!' }),
  ward: zod.string().min(1, { message: 'Ward is required!' }),
  residence: zod.string().min(1, { message: 'Residence is required!' }),
  county: zod.string().min(1, { message: 'County is required!' }),
  subCounty: zod.string().min(1, { message: 'Sub county is required!' }),
  type: zod.string().min(1, { message: 'Type is required!' }),
  valueChainType: zod.string().min(1, { message: 'Value chain type is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser: Stakeholder | any;
};

export function UserManageProfileForm({ currentUser, open, onClose }: Props) {
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [isFarmer, setIsFarmer] = useState<boolean>(false);
  const [stakeholderTypes, setStakeholderTypes] = useState<string[]>([]);

  const defaultValues = useMemo(
    () => ({
      hasInsurance: false,
      insuranceProvider: '',
      insuranceType: '',
      maritalStatus: '',
      businessName: currentUser.businessName || '',
      mobilePhone: currentUser.mobilePhone || '',
      kraPin: currentUser.kraPin || '',
      residence: currentUser.residence || '',
      county: currentUser.county || '',
      subCounty: currentUser.subCounty || '',
      ward: currentUser.ward || '',
      type: currentUser.type || '',
      valueChainType: currentUser.valueChainType || '',
    }),
    [currentUser]
  );

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(isFarmer ? FarmerSchema : NonFarmerSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    let promise;
    if (isFarmer) {
      promise = createFarmer(currentUser.id, {
        hasInsurance: data.hasInsurance,
        insuranceProvider: data.insuranceProvider,
        insuranceType: data.insuranceType,
        maritalStatus: data.maritalStatus,
      });
    } else {
      promise = createStakeholder(currentUser.id, {
        businessName: data.businessName,
        type: data.type,
        mobilePhone: data.mobilePhone,
        yearOfRegistration: new Date(data.yearOfRegistration).getFullYear(),
        kraPin: data.kraPin,
        residence: data.residence,
        county: data.county,
        subCounty: data.subCounty,
        ward: data.ward,
        valueChainType: data.valueChainType,
      });
    }

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Profile created successfully',
        error: 'Profile could not be created!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleCountyChange = (id: number) => {
    setSubCounties(counties.find((county) => county.id === id)?.subCounties || []);
  };

  const handleUserTypeChange = (userType: string) => {
    if (userType === 'FARMER') {
      // add types to schema
      setIsFarmer(true);
    } else {
      // remove types from schema
      setIsFarmer(false);
    }
  };

  // fetch counties

  const getchCounties = () => {
    getCounties()
      .then((data) => {
        setCounties(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch counties');
      });
  };

  const fetchStakeholderTypes = () => {
    getStakeholderTypes()
      .then((data) => {
        setStakeholderTypes(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch stakeholder types');
      });
  };

  // use effect
  useEffect(() => {
    getchCounties();
    fetchStakeholderTypes();
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Manage Profile</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Select account type to view additional infomation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="type" label="Type">
              {stakeholderTypes.map((type) => (
                <MenuItem
                  onClick={() => {
                    handleUserTypeChange(type);
                  }}
                  key={type}
                  value={type}
                >
                  {type}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="valueChainType" label="Value Chain">
              {VALUE_CHAIN_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Field.Select>

            {values.type === 'FARMER' && (
              <>
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

                <Field.Checkbox name="hasInsurance" label="Insured" />
                <Field.Text name="insuranceProvider" label="Insurance provider" />
                <Field.Text name="insuranceType" label="Insurance Type" />
                <Field.Text name="memberNumber" label="Member number" />
              </>
            )}

            {values.type !== 'FARMER' && (
              <>
                <Field.Text name="businessName" label="Business name" />
                <Field.Phone name="mobilePhone" country="KE" label="Business phone" />
                <Field.DatePicker name="yearOfRegistration" label="Year of Reg" />
                <Field.Text name="kraPin" label="Kra PIN" />
                <Field.Text name="residence" label="Residence" />

                <Field.Select name="county" label="County">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {counties.map((county) => (
                    <MenuItem
                      key={county.id}
                      value={county.name}
                      onClick={() => {
                        handleCountyChange(county.id);
                      }}
                    >
                      {county.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="subCounty" label="Sub county">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {subCounties.map((subCounty) => (
                    <MenuItem key={subCounty.id} value={subCounty.name} onClick={() => null}>
                      {subCounty.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Text name="ward" label="Ward" />
              </>
            )}
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
      </Form>
    </Dialog>
  );
}
