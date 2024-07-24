'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ValuechainNewEditForm } from '../new-valuechain-form';

// ----------------------------------------------------------------------

export function ValueChainCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Value Chain"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Value Chain', href: paths.dashboard.cooperative.root },
          { name: 'New Value Chain' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ValuechainNewEditForm />
    </DashboardContent>
  );
}
