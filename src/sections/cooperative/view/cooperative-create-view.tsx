'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CooperativeNewEditForm } from '../cooperative-edit-form';

// ----------------------------------------------------------------------

export function CooperateCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add a cooperate"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperate', href: paths.dashboard.cooperative.root },
          { name: 'New Cooperate' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CooperativeNewEditForm />
    </DashboardContent>
  );
}
