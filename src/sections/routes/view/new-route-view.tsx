'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotificationForm } from '../new-route-form';
// ----------------------------------------------------------------------

export function RouteCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New Route"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Routes', href: paths.dashboard.tickets.root },
          { name: 'New Route' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NotificationForm />
    </DashboardContent>
  );
}
