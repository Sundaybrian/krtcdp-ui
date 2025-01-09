'use client';

import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { ServerErrorIllustration } from 'src/assets/illustrations';

import { varBounce } from 'src/components/animate';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function View401() {
  const router = useRouter();
  const handleRedirect = async () => {
    router.push('/auth/jwt/sign-in/?returnTo=%2orders%2F');
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="My Orders"
        links={[{ name: 'Home', href: '/' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Box>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Please login to view this page
            </Typography>
          </m.div>
          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>Login to view this page</Typography>
          </m.div>
          <m.div variants={varBounce().in}>
            <ServerErrorIllustration sx={{ my: { xs: 5, sm: 10 } }} />
          </m.div>
          <Button onClick={handleRedirect} size="large" variant="contained">
            Login
          </Button>
        </Box>
      </Stack>
    </DashboardContent>
  );
}
