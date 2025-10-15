import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { List, ListItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import {
  adjustMilkQuantity,
  approveMilkAggregation,
  approveTicket,
  searchCoopFarmers,
  transferMilkCollection,
} from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';
import { useDebounce } from 'src/hooks/use-debounce';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';
import { useLocalStorage } from 'src/hooks/use-local-storage';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  targetFarmermemberNumber: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  data: { item: any };
};

export function TransferCollectionDialog({ data, open, onClose }: Props) {
  const [farmerSearchTerm, setFarmerSearchTerm] = useState('');

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const debouncedFarmerSearch = useDebounce(farmerSearchTerm, 300);
  const [farmerOptions, setFarmerOptions] = useState<any[]>([]);
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [farmerValue, setFarmerValue] = useState<number>();

  const defaultValues = useMemo(
    () => ({
      targetFarmermemberNumber: '',
    }),
    []
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

  const onSubmit = handleSubmit(async (d) => {
    const promise = transferMilkCollection(data.item.id, {
      targetFarmermemberNumber: Number(farmerValue),
    });

    try {
      // onClose();
      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Milk collection quantity updated',
        error: 'You request could not be completed at the moment',
      });

      await promise;
      reset();

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
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
        // TODO: Replace with actual API call
        const response = await searchCoopFarmers({
          limit: 20,
          page: 1,
          cooperativeId: state.coopId,
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

  useEffect(() => {
    console.log(data.item);
  }, [data.item]);

  // Effect for debounced farmer search
  useEffect(() => {
    if (debouncedFarmerSearch) {
      searchFarmers(debouncedFarmerSearch);
    }
  }, [debouncedFarmerSearch, searchFarmers]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Transfer Collection</DialogTitle>
        <Divider />
        <Label sx={{ mr: 4, ml: 4 }}>
          {' '}
          Current Farmer: {data?.item?.farmer?.firstName} {data?.item?.farmer?.lastName} | Phone
          Number: {data?.item?.farmer?.mobilePhone}
        </Label>

        <DialogContent>
          <Box gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                {/* Searchable Farmer Select */}
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
                />{' '}
              </Stack>
            </Card>
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
