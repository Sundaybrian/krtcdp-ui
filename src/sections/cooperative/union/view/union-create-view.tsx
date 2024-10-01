'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UnionNewEditForm } from '../union-create-form';

// ----------------------------------------------------------------------

export function UnionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add a new Union"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperate', href: paths.dashboard.cooperative.root },
          { name: 'New union' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UnionNewEditForm />
    </DashboardContent>
  );
}
