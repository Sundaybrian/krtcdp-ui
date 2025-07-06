import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Chip, Divider, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { useSearchAdmins } from 'src/actions/user';
import {
  createNotification,
  createRoute,
  createTicket,
  getCounties,
  getWards,
} from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import useAuthUser from 'src/auth/hooks/use-auth-user';
import { County, SubCounty, Ward } from 'src/api/data.inteface';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  description: zod.string().optional(),
  cooperativeId: zod.number().optional(),
  county: zod.string().optional(),
  subCounty: zod.string().optional(),
  ward: zod.string().optional(),
  estimatedDistance: zod.string().optional(),
  maxCapacity: zod.string().optional(),
  isActive: zod.boolean().optional(),
  estimatedDuration: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function NotificationForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { id } = useAuthUser();

  const userSearch = state.coopId
    ? {
        coopId: Number(state.coopId),
      }
    : {};
  const { userResults } = useSearchAdmins({ ...userSearch });
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      cooperativeId: state.coopId ? Number(state.coopId) : 0,
      county: '',
      subCounty: '',
      ward: '',
      estimatedDistance: '',
      maxCapacity: '',
      isActive: true,
      estimatedDuration: '',
    }),
    [id, state.coopId]
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
    const submitData = {
      ...data,
      estimatedDistance: Number(data.estimatedDistance),
      maxCapacity: Number(data.maxCapacity),
      cooperativeId: state.coopId ? Number(state.coopId) : 0,
    };

    try {
      await createRoute(submitData);
      reset();
      toast.success('Route created successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create route');
    }
  });

  const handleCountyChange = (idNo: number) => {
    setSubCounties(counties.find((county) => county.id === idNo)?.subCounties || []);
  };

  // fetch counties
  const getchCounties = () => {
    getCounties()
      .then((data) => {
        console.log('data', data);
        setCounties(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch counties');
      });
  };

  const fetchWards = (idNew: number) => {
    getWards(idNew)
      .then((data) => {
        setWards(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch wards');
      });
  };

  // use effect
  useEffect(() => {
    getchCounties();
  }, [state.coopId]);

  // methods
  const handleSubCountyChange = (idN: number) => {
    fetchWards(idN);
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
              <Field.Text
                name="name"
                label="Route Name"
                placeholder="Enter route name"
                InputLabelProps={{ shrink: true }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                      key={county.code + county.name}
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
                    <MenuItem
                      key={subCounty.code + subCounty.name}
                      value={subCounty.name}
                      onClick={() => {
                        handleSubCountyChange(subCounty.id);
                      }}
                    >
                      {subCounty.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>

              <Field.Text name="ward" label="Ward" placeholder="Enter ward" />

              <Field.Text multiline rows={4} name="description" label="Description" />

              <Field.Text
                name="estimatedDistance"
                label="Estimated Distance (km)"
                placeholder="Enter estimated distance"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="estimatedDuration"
                label="Estimated Duration (minutes)"
                placeholder="Enter estimated duration"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="maxCapacity"
                label="Max Capacity"
                placeholder="Enter max capacity"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Submit
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
