import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  name: string;
  location: string;
  totalCooperatives: number;
  phoneNumber: string;
};

export function JoinedCoopUnions({
  sx,
  title,
  name,
  location,
  totalCooperatives,
  phoneNumber,
  ...other
}: Props) {
  const row = (label: string, value: any) => (
    <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
      <Box component="span" sx={{ color: 'text.secondary' }}>
        {label}
      </Box>
      <Box component="span">{value}</Box>
    </Box>
  );

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>

      <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ typography: 'h3' }}>{name}</Box>

        {row('Location', location)}
        {row('Contact Phone', phoneNumber)}
        {row('Total Cooperatives', totalCooperatives)}

        <Box sx={{ gap: 2, display: 'flex' }}>
          <Button fullWidth variant="contained">
            Report
          </Button>

          <Button fullWidth variant="contained" color="error">
            Leave
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
