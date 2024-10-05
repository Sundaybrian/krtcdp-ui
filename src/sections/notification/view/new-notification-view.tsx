'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotificationForm } from '../new-notification-form';
// ----------------------------------------------------------------------

export function NotificationCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Broadcast"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Notifications', href: paths.dashboard.notification.root },
          { name: 'New notification' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NotificationForm />
    </DashboardContent>
  );
}
