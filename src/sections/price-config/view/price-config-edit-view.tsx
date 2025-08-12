'use client';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { getPriceConfigById } from 'src/api/services';

import { PriceConfigNewEditForm } from '../price-config-new-form';

// ----------------------------------------------------------------------

type Props = {
  id: number;
};

export async function PriceConfigEditView({ id }: Props) {
  // TODO: Replace with actual API call
  const priceConfig = await getPriceConfigById(Number(id));

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit price configuration"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Price Config', href: paths.dashboard.priceConfig.root },
          { name: priceConfig?.productName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PriceConfigNewEditForm currentPriceConfig={priceConfig} />
    </DashboardContent>
  );
}
