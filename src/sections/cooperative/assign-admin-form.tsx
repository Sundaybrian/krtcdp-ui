import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip, Divider, MenuItem } from '@mui/material';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { useSearchAdmins } from 'src/actions/user';
import { assignAdminToCoop, assignAdminToUnion } from 'src/api/services';
import { useSearchCooperative, useSearchCooperativeUnions } from 'src/actions/cooperative';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  admins: zod.array(zod.any()),
  coopId: zod.any(),
  unionId: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function AssignAdminNewEditForm({ selectedAdmin }: Props) {
  const router = useRouter();
  const { searchResults } = useSearchCooperative();
  const unionData = useSearchCooperativeUnions();
  const [selectedEntity, setSelectedEntity] = useState<any>({
    coop: true,
    coopUnion: false,
  });
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
      if (selectedEntity.coop) {
        await assignAdminToCoop(state.coopId || data.coopId, submitData);
      } else {
        await assignAdminToUnion(data.unionId, { userId: data.admins[0] });
      }
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

  const handleEntityChange = (status: 'active') => {
    setSelectedEntity({
      coop: !selectedEntity.coop,
      coopUnion: !!selectedEntity.coop,
    });
  };

  const handleUnionEntityChange = (status: 'active') => {
    setSelectedEntity({
      coop: !!selectedEntity.coopUnion,
      coopUnion: !selectedEntity.coopUnion,
    });
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
              {!state.coopId && (
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Card sx={{ height: 160, width: 220 }}>
                      <Label color="success">Cooperative Admin</Label>
                      <Box sx={{ padding: 4, textAlign: 'center' }}>
                        <Field.Switch
                          checked={selectedEntity.coop}
                          onClick={() => {
                            handleEntityChange('active');
                          }}
                          label=""
                          name="cooperative"
                        />
                      </Box>
                    </Card>

                    <Card sx={{ height: 160, width: 220 }}>
                      <Label color="error">Cooperative Union Admin</Label>
                      <Box sx={{ padding: 4, textAlign: 'center' }}>
                        <Field.Switch
                          checked={selectedEntity.coopUnion}
                          onClick={() => {
                            handleUnionEntityChange('active');
                          }}
                          label=""
                          name="cooperativeUnion"
                        />
                      </Box>
                    </Card>
                  </Stack>

                  {selectedEntity.coop && (
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

                  {selectedEntity.coopUnion && (
                    <Field.Select name="unionId" label="Cooperative Union">
                      <MenuItem
                        value=""
                        onClick={() => null}
                        sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                      >
                        None
                      </MenuItem>

                      <Divider sx={{ borderStyle: 'dashed' }} />

                      {unionData.searchResults.map((union) => (
                        <MenuItem key={union.name + union.id} value={union.id} onClick={() => {}}>
                          {union.name}--{union.location}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  )}
                </>
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
