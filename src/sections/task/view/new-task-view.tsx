'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TaskForm } from '../new-task-form';
// ----------------------------------------------------------------------

export function TaskCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Task"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Task', href: paths.dashboard.farmer.tasks },
          { name: 'Assign Task' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TaskForm />
    </DashboardContent>
  );
}
