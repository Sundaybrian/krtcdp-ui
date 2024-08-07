import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { Chip, Divider, InputAdornment, MenuItem } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';

import { addUser, assignAdminToCoop, createCooperative, getCounties } from 'src/api/services';
import { County, SubCounty } from 'src/api/data.inteface';
import { INSURANCE_TYPE_OPTIONS, TENANT_LOCAL_STORAGE } from 'src/utils/default';
import { useSearchCooperative } from 'src/actions/cooperative';
import { useSearchAdmins } from 'src/actions/user';
import { PRODUCT_COLOR_NAME_OPTIONS, PRODUCT_CATEGORY_GROUP_OPTIONS } from 'src/_mock';
import { useLocalStorage } from 'src/hooks/use-local-storage';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  admins: zod.array(zod.any()),
  coopId: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function AssignAdminNewEditForm({ selectedAdmin }: Props) {
  const router = useRouter();
  const { searchResults } = useSearchCooperative();
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { userResults } = useSearchAdmins({ userType: 'COOPERATIVE_ADMIN' });

  const defaultValues = useMemo(
    () => ({
      admins: [],
      coopId: state.coopId,
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    data.admins = data.admins.map((admin: any) => admin.id);
    const submitData = {
      admins: data.admins,
    };

    try {
      await assignAdminToCoop(state.coopId || data.coopId, submitData);
      reset();
      toast.success(selectedAdmin ? 'Update success!' : 'Admin assigned successfully!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to assign admin');
    }
  });

  const handleChange = (id: number) => {
    console.log('id', id);
  };

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
              {!state.coopId && (
                <Field.Select name="coopId" label="Cooperative">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {searchResults.map((coop) => (
                    <MenuItem
                      key={coop.mobilePhone}
                      value={coop.id}
                      onClick={() => {
                        handleChange(coop.id);
                      }}
                    >
                      {coop.groupName}--{coop.incorporationNumber}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}

              <Field.Autocomplete
                name="admins"
                label="Admin"
                placeholder="+ User"
                multiple
                freeSolo
                disableCloseOnSelect
                options={userResults.map((user) => user)}
                getOptionLabel={(option) => option.email}
                renderOption={(props, option) => (
                  <li {...props} key={option.email}>
                    {option.firstName}--{option.email}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.email}
                      label={option.email}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />

              {/* <Field.MultiSelect checkbox={true} name="id" label="Admin" options={usersOptions} /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!selectedAdmin ? 'Submit' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
