'use client';

import React from 'react';

// import { paths } from 'src/routes/paths';
import { paths } from '../../../routes/paths';

import { DashboardContent } from '../../../layouts/dashboard';

import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';
import { CategoryNewForm } from '../category-new-form';

// ----------------------------------------------------------------------

export function CategoryCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add a new category"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Categories', href: paths.dashboard.county.root },
          { name: 'New Category' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoryNewForm />
    </DashboardContent>
  );
}
