import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  name: string;
  location: string;
  totalUsers: number;
  phoneNumber: string;
};

export function EnrolledCoop({
  sx,
  title,
  name,
  location,
  totalUsers,
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
        <Box sx={{ typography: 'h6' }}>{name}</Box>

        {row('Location', location)}
        {row('Contact Phone', phoneNumber)}
        {row('Total Users', totalUsers)}

        <Box sx={{ gap: 2, display: 'flex' }}>
          <Button fullWidth variant="contained">
            Remove
          </Button>

          <Button fullWidth variant="contained" color="error">
            Admit
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
