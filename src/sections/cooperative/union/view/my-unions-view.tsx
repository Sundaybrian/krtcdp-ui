'use client';

import type { CreateUnion } from 'src/types/user';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { getCooperativeById } from 'src/api/services';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchCooperativeUnions } from 'src/actions/cooperative';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JoinedCoopUnions } from '../joined-union-list';
import { CoopJoinUnionForm } from '../coop-join-union-form';

// ----------------------------------------------------------------------

export function MyUnionListView() {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { searchResults } = useSearchCooperativeUnions();
  const [coopUnions, setCoopUnions] = useState<CreateUnion[]>([]);

  const quickEdit = useBoolean();

  useEffect(() => {
    if (searchResults.length) {
      getCooperativeById(state.coopId).then((coop) => {
        if (coop) {
          // filter joined unions
          const joinedUnions = searchResults.filter(
            (union) => union.id === coop.cooperativeUnionId
          );

          setCoopUnions(joinedUnions);
        }
      });
    }
  }, [searchResults, state.coopId]);

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
        {!coopUnions.length && (
          <EmptyContent
            title="No union joined"
            action={
              <Button
                onClick={quickEdit.onTrue}
                variant="contained"
                startIcon={<Iconify icon="fluent:add-variant" />}
              >
                Join a union
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
            {coopUnions.map((union) => (
              <JoinedCoopUnions
                title="Union"
                name={union.name}
                location={union.location}
                totalCooperatives={union.totalCooperatives}
                phoneNumber={union.phoneNumber}
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
