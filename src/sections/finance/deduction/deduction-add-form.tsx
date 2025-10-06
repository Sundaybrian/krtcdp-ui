import type { FamerBalace } from 'src/types/transaction';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { TextField, Typography, Autocomplete, CircularProgress } from '@mui/material';

import { useSearchAdmins } from 'src/actions/user';
import {
  searchFarmerBalance,
  createCheckOffDeduction,
  checkAdvanceAvailableLimit,
  searchCoopFarmers,
} from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { CoopFarmerList } from 'src/types/user';
import { useDebounce } from 'src/hooks/use-debounce';
import { AdvaceLimit } from 'src/api/data.inteface';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';
import { useLocalStorage } from 'src/hooks/use-local-storage';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  farmer: zod.any({ message: 'farmer is required!' }),
  transactionType: zod.string({ message: 'Transaction type is required!' }),
  amount: zod.string().min(1, { message: 'Amount is required!' }),
  commodity: zod.string({ message: 'Commodity is required!' }),
  narration: zod.string({ message: 'Narration is required!' }),
  cooperativeId: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  coopId?: number;
  open: boolean;
  onClose: () => void;
};

export function DeductionCreateForm({ coopId, open, onClose }: Props) {
  const farmerData = useSearchAdmins({ userType: 'FARMER', coopId });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  // Farmer selection state
  const [farmerSearchTerm, setFarmerSearchTerm] = useState('');
  const debouncedFarmerSearch = useDebounce(farmerSearchTerm, 300);
  const [farmerOptions, setFarmerOptions] = useState<any[]>([]);
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [farmerAdvance, setFarmerAdvance] = useState<AdvaceLimit>();
  const [farmerBalance, setFarmerBalance] = useState<FamerBalace>({
    id: 0,
    cooperativeId: 0,
    totalOwed: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    overDraft: 0,
  });

  const defaultValues = useMemo(
    () => ({
      userId: '',
      farmer: '',
      cooperativeId: coopId,
      transactionType: '',
      amount: '',
      commodity: '',
      narration: '',
      farmerBalanceId: '',
    }),
    [coopId]
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
      const checkOffData = {
        userId: selectedFarmer.id,
        transactionType: data.transactionType,
        amount: Number.parseFloat(data.amount),
        commodity: data.commodity,
        narration: data.narration,
        farmerBalanceId: farmerBalance.id,
        cooperativeId: coopId,
      };
      await createCheckOffDeduction(checkOffData);
      reset();
      toast.success('Deduction added successfully');
      // router.push(paths.dashboard.user.list);
    } catch (error) {
      toast.error('Failed to add deduction');
      console.error(error);
    }
  });

  const handleOnChangeFarmer = (email: string) => {
    const farmer = farmerData.userResults.find((user) => user.email === email);
    if (!farmer) {
      return;
    }
    // get farmer balance
    searchFarmerBalance({ farmerId: farmer.id })
      .then((response) => {
        const balance = response.results.find((bal) => bal.farmerId === farmer.id);
        setFarmerBalance(balance!);
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
          // name: searchTerm,
          memberNumber: searchTerm,
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

  // Effect for debounced farmer search
  useEffect(() => {
    if (debouncedFarmerSearch) {
      searchFarmers(debouncedFarmerSearch);
    }
  }, [debouncedFarmerSearch, searchFarmers]);

  const getFarmerAdvanceLimit = (farmer: CoopFarmerList) => {
    checkAdvanceAvailableLimit(farmer.id, farmer.Farmer.memberNumber, state.coopId)
      .then((response) => {
        setFarmerAdvance(response);
      })
      .catch((er) => {
        console.log(er);
      });
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          Add deduction
          {selectedFarmer && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="success.dark">
                ✓ Selected Farmer: {selectedFarmer?.firstName} {selectedFarmer.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Member No: {selectedFarmer?.Farmer.memberNumber} | Phone:{' '}
                {selectedFarmer.mobilePhone || 'N/A'}
              </Typography>
              {farmerAdvance && (
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ display: 'block', mt: 1, fontWeight: 'medium' }}
                >
                  Available Advance: KES {farmerAdvance.availableAdvance?.toLocaleString() || 0}
                </Typography>
              )}
            </Box>
          )}
        </DialogTitle>
        <Card sx={{ p: 3 }}>
          <DialogContent>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Autocomplete
                options={farmerOptions}
                loading={farmerLoading}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName} ${option?.Farmer?.memberNumber}` || ''
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onInputChange={(event, newInputValue) => {
                  setFarmerSearchTerm(newInputValue);
                }}
                onChange={(event, newValue) => {
                  setSelectedFarmer(newValue);

                  // get farmer advance limit
                  if (newValue.id) {
                    getFarmerAdvanceLimit(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Farmer"
                    name="farmer"
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

              <Field.Select name="transactionType" label="Transaction Type">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {['LOAN', 'DEDUCTION', 'ADVANCE'].map((type) => (
                  <MenuItem key={type} value={type} onClick={() => {}}>
                    {type}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="amount" label="Amount" />
              <Field.Text name="commodity" label="Commodity" />
              <Field.Text name="narration" label="Narration" />
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
        </Card>
      </Form>
    </Dialog>
  );
}
