'use client';

import type { Cooperative } from 'src/types/user';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCooperativeByUnionId } from 'src/api/services';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import useAuthUser from 'src/auth/hooks/use-auth-user';

import { EnrolledCoop } from '../enrolled-coop';
import { CoopJoinUnionForm } from '../coop-join-union-form';

// ----------------------------------------------------------------------

export function MyCooperativeListView() {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const auth = useAuthUser();

  const [cooperative, setCooperative] = useState<Cooperative[] | null>(null);

  const quickEdit = useBoolean();
  console.log('auth.coopId', auth);

  useEffect(() => {
    // console.log('auth.coopId', auth.coopId);
    console.log('auth.coopId', auth.coopUnionId);

    getCooperativeByUnionId(1).then((response) => {
      console.log('response', response);

      setCooperative(response);
    });
  }, [auth.coopUnionId]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="My Cooperatives"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'My Cooperatives' }]}
        action={
          <Button
            onClick={quickEdit.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Cooperative
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: 2 },
          flexDirection: { md: 'column' },
        }}
      >
        {!cooperative?.length && (
          <EmptyContent
            title="No cooperative onboarded"
            action={
              <Button
                onClick={quickEdit.onTrue}
                variant="contained"
                startIcon={<Iconify icon="fluent:add-variant" />}
              >
                Onboard
              </Button>
            }
          />
        )}

        <Grid xs={12} md={6} lg={4}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
          >
            {cooperative?.map((coop) => (
              <EnrolledCoop
                key={coop.id}
                title="Cooperative"
                name={coop.groupName}
                location={coop.county}
                totalUsers={coop.admins?.length || 0}
                phoneNumber={coop.mobilePhone}
              />
            ))}
          </Box>
        </Grid>
      </Card>

      {/* Assign coop to union dialog */}
      <CoopJoinUnionForm coopId={state.coopId} open={quickEdit.value} onClose={quickEdit.onFalse} />
    </DashboardContent>
  );
}
