'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotificationForm } from '../new-shift-form';
// ----------------------------------------------------------------------

export function RouteCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New Shift"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Shifts', href: paths.dashboard.tickets.root },
          { name: 'New Shift' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NotificationForm />
    </DashboardContent>
  );
}
