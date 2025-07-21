'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewEditStageForm } from '../new-stage-form';
// ----------------------------------------------------------------------

export function StageCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New Stage"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Stages', href: paths.dashboard.collections.stages.root },
          { name: 'New Stage' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NewEditStageForm />
    </DashboardContent>
  );
}
