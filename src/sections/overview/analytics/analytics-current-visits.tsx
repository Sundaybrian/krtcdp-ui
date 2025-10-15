import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCurrentVisits({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.light,
    theme.palette.info.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: true } } } },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Divider />

      {/* <Chart
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: 'auto' }}
      /> */}
      <Box sx={{ my: 6, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 3,
            p: 1,
            borderRadius: '4%',
            border: '2px solid rgba(59, 116, 62, 0.2)',
          }}
        >
          <small>Disbursed Advance</small>
          <Typography>{fNumber(chart.series[0].value)}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 3,
            p: 1,
            borderRadius: '4%',
            border: '2px solid rgba(193, 227, 125, 0.2)',
          }}
        >
          <small>Outstanding Advance</small>
          <Typography sx={{ padding: '1em', borderRadius: '4%', border: 'rgba(140, 77, 77, 0.2)' }}>
            {fNumber(chart.series[1].value)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ my: 6, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 3,
            p: 1,
            borderRadius: '4%',
            border: '2px solid rgba(47, 36, 119, 0.2)',
          }}
        >
          <small>Amount Paid</small>

          <Typography sx={{ padding: '1em', borderRadius: '4%', border: 'rgba(140, 77, 77, 0.2)' }}>
            {fNumber(chart.series[2].value)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 3,
            p: 1,
            borderRadius: '4%',
            border: '2px solid rgba(205, 72, 72, 0.2)',
          }}
        >
          <small>Outstanding Balance</small>

          <Typography sx={{ padding: '1em', borderRadius: '4%', border: 'rgba(140, 77, 77, 0.2)' }}>
            {fNumber(chart.series[3].value)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}
