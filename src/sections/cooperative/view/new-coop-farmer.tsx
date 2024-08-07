'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CoopFarmerNewEditForm } from '../new-coop-farmer-form';

// ----------------------------------------------------------------------

export function NewCoopFarmerCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add coop farmer"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperate', href: paths.dashboard.cooperative.root },
          { name: 'New Coop Farmer' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CoopFarmerNewEditForm />
    </DashboardContent>
  );
}
