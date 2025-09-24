import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import {
  createCategory,
  createPurchaseOrder,
  searchCoopFarmers,
  searchGrn,
} from 'src/api/services';
import { Grn } from 'src/types/farm';
import { Autocomplete, CircularProgress, TextField, Typography } from '@mui/material';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { useDebounce } from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  amount: zod.string({ message: 'Amount name is required!' }),
  terms: zod.string().optional(),
  grnId: zod.any(),
  farmerId: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function OrderNewForm({ currentUser }: Props) {
  const [farmerSearchTerm, setFarmerSearchTerm] = useState('');

  const [grn, setGrn] = useState<Grn[]>([]);
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const debouncedFarmerSearch = useDebounce(farmerSearchTerm, 300);
  const [farmerOptions, setFarmerOptions] = useState<any[]>([]);
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [farmerValue, setFarmerValue] = useState<number>();
  const [grnId, setGrnId] = useState<number>();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      amount: '',
      terms: '',
      grnId: '',
      farmerId: '',
      cooperativeId: state.coopId,
    }),
    [state.coopId]
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

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    try {
      await createPurchaseOrder({
        orderDate: new Date().toISOString(),
        amount: Number.parseFloat(data.amount),
        terms: data.terms,
        grnId: Number(grnId),
        farmerId: Number(farmerValue),
        cooperativeId: state.coopId,
      });
      toast.success(currentUser ? 'Update success!' : 'Category created successfully!');
      // router.push(paths.dashboard.user.list);
      reset();
    } catch (error) {
      console.error(error);
      toast.error(`Error creating purchase order:   ${error.message}`);
    }
  });

  // Search functions
  const searchFarmers = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setFarmerOptions([]);
        return;
      }

      setFarmerLoading(true);
      try {
        const response = await searchCoopFarmers({
          limit: 20,
          page: 1,
          cooperativeId: state.coopId,
          name: searchTerm,
        });

        const dataRes = await response.results;
        setFarmerOptions(dataRes || []);
      } catch (error) {
        console.error('Error searching farmers:', error);
        setFarmerOptions([]);
      } finally {
        setFarmerLoading(false);
      }
    },
    [state.coopId]
  );

  useEffect(() => {
    searchGrn({ cooperativeId: state.coopId, status: 'PENDING' })
      .then((data) => {
        setGrn(data.results);
      })
      .catch((error) => {
        toast.error(`Error fetching GRN: ${error.message}`);
      });
  }, [state.coopId]);

  // Effect for debounced farmer search
  useEffect(() => {
    if (debouncedFarmerSearch) {
      searchFarmers(debouncedFarmerSearch);
    }
  }, [debouncedFarmerSearch, searchFarmers]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="amount" label="Amount" InputLabelProps={{ shrink: true }} />
              <Autocomplete
                options={grn}
                getOptionLabel={(option) =>
                  `${option.id} -- ${option.farmer.firstName} ${option.farmer.lastName}` || ''
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  const grnIdNew = newValue ? newValue.id : 0;
                  setGrnId(grnIdNew);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search GRN"
                    placeholder="Type to search GRN..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {farmerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <Field.Text name="terms" label="Terms" InputLabelProps={{ shrink: true }} />
              {/* Searchable Farmer Select */}
              <Autocomplete
                options={farmerOptions}
                loading={farmerLoading}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}` || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onInputChange={(event, newInputValue) => {
                  setFarmerSearchTerm(newInputValue);
                }}
                onChange={(event, newValue) => {
                  const farmerId = newValue ? newValue.id : 0;
                  setFarmerValue(farmerId);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Farmer"
                    placeholder="Type to search farmers..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {farmerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2">
                        {option.firstName} {option.middleName || ''} {option.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {option.id} | Phone: {option.mobilePhone || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Submit' : 'Submit'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
