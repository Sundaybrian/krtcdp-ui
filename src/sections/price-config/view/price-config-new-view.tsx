'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PriceConfigNewEditForm } from '../price-config-new-form';

// ----------------------------------------------------------------------

export function PriceConfigCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new price configuration"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Price Config', href: paths.dashboard.priceConfig.root },
          { name: 'New price config' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PriceConfigNewEditForm />
    </DashboardContent>
  );
}
