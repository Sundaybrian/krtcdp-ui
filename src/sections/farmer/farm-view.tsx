import type { Farm, Expense } from 'src/types/farm';
import type { IPaymentCard } from 'src/types/common';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { MapViewDialog } from './map';
import { ExpenseListDialog } from './expenses';

// ----------------------------------------------------------------------

type Props = {
  cardList: IPaymentCard[];
  expenses: Expense[];
  farms: Farm[];
  onSelectFarm: (farmId: number) => void;
};

export function FarmView({ cardList, expenses, farms, onSelectFarm }: Props) {
  const openAddress = useBoolean();

  const openCards = useBoolean();

  const primaryCard = cardList.filter((card) => card.primary)[0];

  const [selectedFarm, setSelectedFarm] = useState<Farm>(farms[0]);

  const [selectedCard, setSelectedCard] = useState<IPaymentCard | null>(primaryCard);

  const handleSelectPlan = useCallback(
    (newValue: number) => {
      const currentFarm = farms.filter((farm) => farm.id === Number(newValue))[0];
      setSelectedFarm(currentFarm);
      onSelectFarm(currentFarm.id);
    },
    [farms, onSelectFarm]
  );

  const handleSelectCard = useCallback((newValue: IPaymentCard | null) => {
    setSelectedCard(newValue);
  }, []);

  useEffect(() => {
    onSelectFarm(farms[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPlans = farms.map((farm) => (
    <Grid xs={12} md={4} key={farm.id}>
      <Paper
        variant="outlined"
        onClick={() => handleSelectPlan(farm.id)}
        sx={{
          p: 2.5,
          cursor: 'pointer',
          position: 'relative',
          // ...(farm.farmingCategory && { opacity: 0.48, cursor: 'default' }),
          ...(farm.id === selectedFarm?.id && {
            boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.text.primary}`,
          }),
        }}
      >
        {farm.farmingCategory && (
          <Label variant="filled" color="error" sx={{ position: 'absolute', top: 8, right: 8 }}>
            {farm.farmingCategory}
          </Label>
        )}

        {/* {plan.subscription === 'basic' && <PlanFreeIcon />}
        {plan.subscription === 'starter' && <PlanStarterIcon />}
        {plan.subscription === 'premium' && <PlanPremiumIcon />} */}

        <Box
          sx={{
            typography: 'subtitle2',
            mt: 2,
            mb: 0.5,
            textTransform: 'capitalize',
          }}
        >
          {farm.county}
        </Box>

        <Stack direction="row" alignItems="center" sx={{ typography: 'h4' }}>
          <Box component="span">{farm.ecologicalZone}</Box>
        </Stack>
      </Paper>
    </Grid>
  ));

  return (
    <>
      <Card>
        <CardHeader title="Farms" />

        <Grid container spacing={2} sx={{ p: 3 }}>
          {renderPlans}
        </Grid>

        <Stack spacing={2} sx={{ p: 3, pt: 0, typography: 'body2' }}>
          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Farm Details
            </Grid>
            <Grid xs={12} md={8} sx={{ typography: 'subtitle2', textTransform: 'capitalize' }}>
              {selectedFarm?.ward || '-'} {selectedFarm?.subCounty || '-'}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Size (Arce)
            </Grid>
            <Grid xs={12} md={8}>
              {selectedFarm?.sizeInAcres || '-'}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Ownership type
            </Grid>
            <Grid xs={12} md={8} sx={{ color: 'text.secondary' }}>
              {selectedFarm?.ownershipType}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              County
            </Grid>
            <Grid xs={12} md={8} sx={{ color: 'text.secondary' }}>
              {selectedFarm?.county}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Zone
            </Grid>
            <Grid xs={12} md={8}>
              {selectedFarm?.ecologicalZone || '-'}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Location
            </Grid>
            <Grid xs={12} md={8}>
              <Button
                onClick={openCards.onTrue}
                endIcon={<Iconify width={16} icon="eva:arrow-ios-downward-fill" />}
                sx={{ typography: 'subtitle2', p: 0, borderRadius: 0 }}
              >
                View
              </Button>
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
          {/* <Button variant="outlined">Cancel plan</Button> */}
          <Button onClick={openAddress.onTrue} variant="contained">
            Add expense
          </Button>
        </Stack>
      </Card>

      <MapViewDialog
        list={cardList}
        open={openCards.value}
        onClose={openCards.onFalse}
        selected={(selectedId: string) => selectedCard?.id === selectedId}
        onSelect={handleSelectCard}
      />

      <ExpenseListDialog
        farmId={selectedFarm.id}
        expenses={expenses}
        list={selectedFarm.partitions || []}
        open={openAddress.value}
        onClose={openAddress.onFalse}
      />
    </>
  );
}
