'use client';

import { paths } from 'src/routes/paths';

import { getStorage } from 'src/hooks/use-local-storage';

import { requiredPermissions } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { ProductNewEditForm } from '../product-new-edit-form';

// ----------------------------------------------------------------------

export function ProductCreateView() {
  const perms = getStorage('permissions');
  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.product.createProduct) === false && !isSuperAdmin) {
    return <PermissionDeniedView permission="createProduct" />;
  }
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.dashboard.product.root },
          { name: 'New product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProductNewEditForm />
    </DashboardContent>
  );
}
