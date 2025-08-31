import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState, useCallback } from 'react';
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
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { List, ListItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { approveMilkAggregation, approveTicket, getUsers } from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';
import { useSearchShifts } from 'src/actions/collections';
import { useSearchRoutes } from 'src/actions/route';
import { useLocalStorage, getStorage } from 'src/hooks/use-local-storage';
import { useDebounce } from 'src/hooks/use-debounce';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';
import { UseSetStateReturn } from 'src/hooks/use-set-state';
import { type Ifilter } from '../collection-table-toolbar';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  status: zod.string(),
  shift: zod.number().optional(),
  route: zod.number().optional(),
  startDate: zod.any(),
  endDate: zod.any(),
  farmer: zod.number().optional(),
  collector: zod.number().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  filters: UseSetStateReturn<Ifilter>;
};

export function FilterDialog({ filters, open, onClose }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  // State for searchable selects
  const [farmerSearchTerm, setFarmerSearchTerm] = useState('');
  const [collectorSearchTerm, setCollectorSearchTerm] = useState('');
  const [farmerOptions, setFarmerOptions] = useState<any[]>([]);
  const [collectorOptions, setCollectorOptions] = useState<any[]>([]);
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [collectorLoading, setCollectorLoading] = useState(false);

  // Debounced search terms
  const debouncedFarmerSearch = useDebounce(farmerSearchTerm, 300);
  const debouncedCollectorSearch = useDebounce(collectorSearchTerm, 300);

  const { searchResults: shifts } = useSearchShifts({
    cooperativeId: state.coopId,
  });

  const { searchResults: routes } = useSearchRoutes({
    cooperativeId: state.coopId,
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
        const response = await getUsers({
          limit: 20,
          coopId: state.coopId,
          firstName: searchTerm,
          // lastName: searchTerm,
        });

        const data = await response.results;
        setFarmerOptions(data || []);
      } catch (error) {
        console.error('Error searching farmers:', error);
        setFarmerOptions([]);
      } finally {
        setFarmerLoading(false);
      }
    },
    [state.coopId]
  );

  const searchCollectors = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setCollectorOptions([]);
        return;
      }

      setCollectorLoading(true);
      try {
        // TODO: Replace with actual API call
        const response = await getUsers({
          limit: 20,
          coopId: state.coopId,
          firstName: searchTerm,
          // lastName: searchTerm,
        });
        const data = await response.results;
        setCollectorOptions(data || []);
      } catch (error) {
        console.error('Error searching collectors:', error);
        setCollectorOptions([]);
      } finally {
        setCollectorLoading(false);
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

  // Effect for debounced collector search
  useEffect(() => {
    if (debouncedCollectorSearch) {
      searchCollectors(debouncedCollectorSearch);
    }
  }, [debouncedCollectorSearch, searchCollectors]);

  const defaultValues = useMemo(
    () => ({
      status: '',
      startDate: '',
      endDate: '',
      shift: 0,
      route: 0,
      farmer: 0,
      collector: 0,
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Apply filters
      filters.setState({
        status: data.status || undefined,
        shift: data.shift || undefined,
        route: data.route || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        farmer: data.farmer || undefined,
        collector: data.collector || undefined,
      });

      toast.success('Filters applied successfully');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to apply filters');
    }
  });

  const handleClearFilters = () => {
    filters.setState({
      status: undefined,
      shift: undefined,
      route: undefined,
      startDate: undefined,
      endDate: undefined,
      farmer: undefined,
      collector: undefined,
    });
    reset();
    setFarmerSearchTerm('');
    setCollectorSearchTerm('');
    setFarmerOptions([]);
    setCollectorOptions([]);
    toast.success('Filters cleared');
    onClose();
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
        <DialogTitle>Filter Collections</DialogTitle>

        <DialogContent>
          <Box gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Select name="shift" label="Shift">
                  <MenuItem value={0}>
                    <em>All Shifts</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {shifts.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="route" label="Route">
                  <MenuItem value={0}>
                    <em>All Routes</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="status" label="Status">
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {['COLLECTED', 'VERIFIED', 'REJECTED', 'SPILLAGE_REPORTED'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.DatePicker name="startDate" label="Start Date" />

                <Field.DatePicker name="endDate" label="End Date" />

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
                    setValue('farmer', farmerId);
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

                {/* Searchable Collector Select */}
                <Autocomplete
                  options={collectorOptions}
                  loading={collectorLoading}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}` || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onInputChange={(event, newInputValue) => {
                    setCollectorSearchTerm(newInputValue);
                  }}
                  onChange={(event, newValue) => {
                    const collectorId = newValue ? newValue.id : 0;
                    setValue('collector', collectorId);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Collector"
                      placeholder="Type to search collectors..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {collectorLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
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
              </Stack>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>

          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Apply Filters
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
