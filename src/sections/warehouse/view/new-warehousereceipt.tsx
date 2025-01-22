'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WarehouseNewEditForm } from '../new-warehousereceipt-form';

// ----------------------------------------------------------------------

export function NewCoopWareHouseCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add Receipt"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Warehouse Receipts', href: paths.dashboard.farmer.warehouse },
          { name: 'New Receipt' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <WarehouseNewEditForm />
    </DashboardContent>
  );
}
