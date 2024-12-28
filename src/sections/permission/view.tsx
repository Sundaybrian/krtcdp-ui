'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Alert } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

import { DashboardContent } from 'src/layouts/dashboard';

import { useMockedUser } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------
export type Prop = {
  permission?: string;
};
export function PermissionDeniedView({ permission }: Prop) {
  const { user } = useMockedUser();

  return (
    <DashboardContent>
      <RoleBasedGuard
        permission={permission}
        hasContent
        currentRole={user?.role}
        acceptRoles={[]}
        sx={{ py: 10 }}
      >
        <Box>
          <Card>
            <CardHeader title="Permission denied" />
            {permission && (
              <>
                <Alert color="error">{permission}</Alert>{' '}
                <small>is required to access this page</small>
              </>
            )}
          </Card>
        </Box>
      </RoleBasedGuard>
    </DashboardContent>
  );
}
