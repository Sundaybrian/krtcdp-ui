'use client';

import type { IProductItem } from 'src/types/product';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';

import { getStorage } from 'src/hooks/use-local-storage';

import { requiredPermissions } from 'src/utils/default';

import { getProductById } from 'src/api/services';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { ProductNewEditForm } from '../product-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  // product?: IProductItem;
};

export function ProductEditView({ id }: Props) {
  const [product, setProduct] = useState<IProductItem>({} as any);
  const perms = getStorage('permissions');
  useEffect(() => {
    getProductById(Number(id)).then((response) => {
      setProduct(response);
    });
  }, [id]);

  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.product.updateProduct) === false && !isSuperAdmin) {
    return <PermissionDeniedView permission="updateProduct" />;
  }
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.dashboard.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm currentProduct={product} />
    </DashboardContent>
  );
}
