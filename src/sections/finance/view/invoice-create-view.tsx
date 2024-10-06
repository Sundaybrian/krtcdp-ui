'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InvoiceNewEditForm } from '../invoice-new-edit-form';

// ----------------------------------------------------------------------

export function BnakUploadCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Upload payment file"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bank files', href: paths.dashboard.payments.root },
          { name: 'Upload' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceNewEditForm />
    </DashboardContent>
  );
}
