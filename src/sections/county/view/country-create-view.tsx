'use client';

import React from 'react';

// import { paths } from 'src/routes/paths';
import { paths } from '../../../routes/paths';

import { DashboardContent } from '../../../layouts/dashboard';

import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';
import { CountyNewForm } from '../county-new-form';

// ----------------------------------------------------------------------

export function CountyCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add a new user"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'County', href: paths.dashboard.county.root },
          { name: 'New County' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CountyNewForm />
    </DashboardContent>
  );
}
