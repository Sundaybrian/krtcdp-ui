'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleForm } from '../new-role-form';
// ----------------------------------------------------------------------

export function RoleCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Roles"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Roles', href: paths.dashboard.permission.roles },
          { name: 'New role' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoleForm />
    </DashboardContent>
  );
}
