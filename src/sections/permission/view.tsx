'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { DashboardContent } from 'src/layouts/dashboard';

import { useMockedUser } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export function PermissionDeniedView() {
  const { user } = useMockedUser();

  return (
    <DashboardContent>
      <RoleBasedGuard hasContent currentRole={user?.role} acceptRoles={[]} sx={{ py: 10 }}>
        <Box>
          <Card>
            <CardHeader title="Permission denied" />
          </Card>
        </Box>
      </RoleBasedGuard>
    </DashboardContent>
  );
}
