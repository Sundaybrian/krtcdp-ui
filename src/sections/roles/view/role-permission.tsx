import type { Action, Permission } from 'src/api/data.inteface';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { createRolePermission } from 'src/api/permission';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  activityProcess: zod.string(),
  target: zod.string().min(1, 'Target is required'),
  activityType: zod.string().min(1, 'Activity type is required'),
  imageUrl: zod.any(),
  partitionId: zod.number(),
  expenseAmount: zod.string().min(1, 'Amount is required'),
  notes: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  roleId: number;
  actions: Action[];
  role?: string;
  rolePermissions: Permission[];
};

export function RolePermissionDialog({
  role,
  open,
  actions,
  roleId,
  rolePermissions,
  onClose,
  title = `Assign role permission to`,
}: Props) {
  const [searchAddress, setSearchAddress] = useState('');
  const [openForm, setOpenForm] = useState(false);
  // get action id from rolePermissions
  const actionIds = rolePermissions.map((permission) => permission.actionId);
  // add checked property to actions
  actions.forEach((action) => {
    action.selected = actionIds.includes(action.id);
  });

  const [permACtions, setActions] = useState(actions);

  const handlePermissionSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, actionId: number) => {
      const newActions = permACtions.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            selected: event.target.checked,
          };
        }
        return action;
      });

      setActions(newActions);
    },
    [permACtions]
  );

  const dataFiltered = applyFilter({ inputData: permACtions, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const defaultValues = useMemo(
    () => ({
      activityProcess: '',
      target: '',
      activityType: '',
      imageUrl: '',
      partitionId: 0,
      expenseAmount: '',
      notes: '',
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
    formState: { isSubmitting },
  } = methods;

  const handleSearchAddress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSubmit = async () => {
    const selectedActions = permACtions.filter((action) => action.selected);
    // create payload
    const payload = selectedActions.map((action) => ({
      roleId,
      actionId: action.id,
    }));

    try {
      await createRolePermission(payload);
      reset();
      toast.success('Permission assigned to role');
      // router.push(paths.dashboard.user.list);
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again!');
    }
  };

  const renderList = (
    <Scrollbar sx={{ p: 0.5, maxHeight: 700 }}>
      {/* {add checkbox} */}

      {dataFiltered.map((action) => (
        <Stack
          direction="row"
          sx={{
            // py: 1,
            // my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'space-between',
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Label
            key={action.id}
            variant="filled"
            color="primary"
            sx={{ textTransform: 'capitalize' }}
          >
            {action.name}
          </Label>

          <Checkbox
            disableRipple
            size="small"
            checked={action.selected}
            onChange={(e) => {
              handlePermissionSelection(e, action.id);
            }}
          />
        </Stack>
      ))}
    </Scrollbar>
  );

  useEffect(() => {
    setActions(actions);
  }, [actions]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6">
          {' '}
          {title} <Label color="success">{role}</Label>{' '}
        </Typography>
        <Box>
          <Button sx={{ mr: 1 }} variant="outlined" size="small" color="error" onClick={onClose}>
            Exit
          </Button>
        </Box>
      </Stack>
      {!openForm && (
        <>
          <Stack sx={{ p: 2, pt: 0 }}>
            <TextField
              value={searchAddress}
              onChange={handleSearchAddress}
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {notFound ? (
            <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
          ) : (
            renderList
          )}

          {/* submit button */}
          <Stack sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Stack>
        </>
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: Action[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    return inputData.filter(
      (address) => address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
