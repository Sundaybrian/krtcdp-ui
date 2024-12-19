'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserRoleForm } from '../new-user-role-form';
// ----------------------------------------------------------------------

export function UserRoleCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Roles"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User Role', href: paths.dashboard.permission.roles },
          { name: 'New user role' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserRoleForm />
    </DashboardContent>
  );
}
