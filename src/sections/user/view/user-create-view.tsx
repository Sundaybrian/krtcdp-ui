'use client';

import { paths } from 'src/routes/paths';

import { getStorage } from 'src/hooks/use-local-storage';

import { requiredPermissions } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  const perms = getStorage('permissions');

  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.users.createUser) === false && !isSuperAdmin) {
    return <PermissionDeniedView />;
  }
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add a new user"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'New user' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
