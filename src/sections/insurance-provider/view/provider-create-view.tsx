'use client';

import { paths } from 'src/routes/paths';

import { getStorage } from 'src/hooks/use-local-storage';

import { requiredPermissions } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { ProviderNewEditForm } from './new-provider-form';

// ----------------------------------------------------------------------

export function ProviderCreateView() {
  const perms = getStorage('permissions');
  const { permissions = [], isSuperAdmin = false } = perms;

  if (
    permissions.includes(requiredPermissions.insurance.createInsuranceProvider) === false &&
    !isSuperAdmin
  ) {
    return <PermissionDeniedView permission="createInsuranceProvider" />;
  }
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New Provider"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Providers', href: paths.dashboard.insuranceProviders.root },
          { name: 'New Provider' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProviderNewEditForm />
    </DashboardContent>
  );
}
