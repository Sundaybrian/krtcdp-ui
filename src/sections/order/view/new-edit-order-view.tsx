'use client';

import React from 'react';

// import { paths } from 'src/routes/paths';
import { paths } from '../../../routes/paths';

import { DashboardContent } from '../../../layouts/dashboard';

import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';
import { OrderNewForm } from '../new-order-form';

// ----------------------------------------------------------------------

export function PurchaseOrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New purchase order"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Oders', href: paths.dashboard.county.root },
          { name: 'New order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OrderNewForm />
    </DashboardContent>
  );
}
