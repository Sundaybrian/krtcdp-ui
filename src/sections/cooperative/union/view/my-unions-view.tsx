'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchCooperativeUnions } from 'src/actions/cooperative';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JoinedCoopUnions } from '../joined-union-list';
import { CoopJoinUnionForm } from '../coop-join-union-form';

// ----------------------------------------------------------------------

export function MyUnionListView() {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { searchResults } = useSearchCooperativeUnions();

  const quickEdit = useBoolean();

  useEffect(() => {
    if (searchResults.length) {
      //
    }
  }, [searchResults]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="My Unions"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'My Unions' }]}
        action={
          <Button
            onClick={quickEdit.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Join Union
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
        {/* <EmptyContent
          title="No union onboarded"
          action={
            <Button
              onClick={quickEdit.onTrue}
              variant="contained"
              startIcon={<Iconify icon="fluent:add-variant" />}
            >
              Join a union
            </Button>
          }
        /> */}

        <Grid xs={12} md={6} lg={4}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
          >
            <JoinedCoopUnions
              title="Union"
              name="Nakuru Farmers Union"
              location="Nakuru"
              totalCooperatives={5}
              phoneNumber="07157829"
            />
          </Box>
        </Grid>
      </Card>

      {/* Assign coop to union dialog */}
      <CoopJoinUnionForm coopId={state.coopId} open={quickEdit.value} onClose={quickEdit.onFalse} />
    </DashboardContent>
  );
}
