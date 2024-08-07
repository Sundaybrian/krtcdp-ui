'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AssignAdminNewEditForm } from '../assign-admin-form';

// ----------------------------------------------------------------------

export function AssignAdminCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Assign Admin"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperate', href: paths.dashboard.cooperative.root },
          { name: 'New coop admin' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AssignAdminNewEditForm />
    </DashboardContent>
  );
}
