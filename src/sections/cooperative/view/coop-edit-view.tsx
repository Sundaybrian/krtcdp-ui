'use client';

import { useState, useEffect } from 'react';
import { getCooperativeById } from 'src/api/services';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CooperativeNewEditForm } from '../cooperative-edit-form';

// ----------------------------------------------------------------------

type Props = {
  cooperativeId: string;
};

export function CooperativeEditView({ cooperativeId }: Props) {
  const [cooperative, setCooperative] = useState<any>({});
  const getCooperative = async () => {
    const response = await getCooperativeById(Number(cooperativeId));
    setCooperative(response);
  };

  useEffect(() => {
    getCooperative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooperativeId]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cooperative Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperative', href: paths.dashboard.user.root },
          { name: cooperative?.groupName || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CooperativeNewEditForm cooperative={cooperative} />
    </DashboardContent>
  );
}
