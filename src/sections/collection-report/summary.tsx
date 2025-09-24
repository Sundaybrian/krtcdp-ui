'use client';

import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type SummaryData = {
  totalQuantity: number;
  milkDensityReading: number;
  addedWater: number;
  collectedCount: number;
  pendingCount: number;
};

type Props = {
  data: SummaryData;
};

// ----------------------------------------------------------------------

export function CollectionSummary({ data }: Props) {
  const theme = useTheme();

  const totalCollections = data.collectedCount + data.pendingCount;
  const collectionRate = totalCollections > 0 ? (data.collectedCount / totalCollections) * 100 : 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Total Quantity Card */}
      <Grid xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Quantity"
          value={`${fNumber(data.totalQuantity)} KG`}
          icon="solar:cup-hot-bold-duotone"
          color={theme.palette.primary.main}
          bgColor={theme.palette.primary.lighter}
        />
      </Grid>

      {/* Milk Density Reading Card */}
      <Grid xs={12} sm={6} md={3}>
        <SummaryCard
          title="Avg Milk Density"
          value={`${data.milkDensityReading.toFixed(2)}`}
          icon="solar:test-tube-bold-duotone"
          color={theme.palette.info.main}
          bgColor={theme.palette.info.lighter}
        />
      </Grid>

      {/* Added Water Card */}
      <Grid xs={12} sm={6} md={3}>
        <SummaryCard
          title="Avg Added Water"
          value={`${data.addedWater.toFixed(2)}%`}
          icon="solar:water-drop-bold-duotone"
          color={theme.palette.warning.main}
          bgColor={theme.palette.warning.lighter}
        />
      </Grid>

      {/* Collection Status Card */}
      <Grid xs={12} sm={6} md={3}>
        <CollectionStatusCard
          collectedCount={data.collectedCount}
          pendingCount={data.pendingCount}
          collectionRate={collectionRate}
        />
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------

type SummaryCardProps = CardProps & {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
};

function SummaryCard({ title, value, icon, color, bgColor, sx, ...other }: SummaryCardProps) {
  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ mt: 1 }}>
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: bgColor,
        }}
      >
        <Iconify icon={icon} width={32} sx={{ color }} />
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CollectionStatusCardProps = CardProps & {
  collectedCount: number;
  pendingCount: number;
  collectionRate: number;
};

function CollectionStatusCard({
  collectedCount,
  pendingCount,
  collectionRate,
  sx,
  ...other
}: CollectionStatusCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Collection Status
        </Typography>

        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="h4" component="span" sx={{ color: theme.palette.success.main }}>
            {collectedCount}
          </Typography>
          <Typography variant="body2" component="span" sx={{ color: 'text.secondary', ml: 1 }}>
            collected
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify
            icon={
              collectionRate >= 80
                ? 'solar:double-alt-arrow-up-bold-duotone'
                : 'solar:double-alt-arrow-down-bold-duotone'
            }
            width={16}
            sx={{
              color: collectionRate >= 80 ? 'success.main' : 'warning.main',
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{ color: collectionRate >= 80 ? 'success.main' : 'warning.main' }}
          >
            {fPercent(collectionRate)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            completion rate
          </Typography>
        </Box>

        {pendingCount > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            {pendingCount} pending collections
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: theme.palette.success.lighter,
        }}
      >
        <Iconify
          icon="solar:clipboard-check-bold-duotone"
          width={32}
          sx={{ color: theme.palette.success.main }}
        />
      </Box>
    </Card>
  );
}
