'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { getFarmerById } from 'src/api/services';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingScreen } from 'src/components/loading-screen';

import { CoopFarmerNewEditForm } from '../new-coop-farmer-form';

// ----------------------------------------------------------------------

export function EditCoopFarmerCreateView() {
  // coop farmer id from router
  const params = useParams();

  const coopFarmerId = params.id as string;

  console.log('coopFarmerId', coopFarmerId);

  const [farmer, setFarmer] = useState<any>({});
  const getCooperative = async () => {
    const response = await getFarmerById(Number(coopFarmerId));
    const newFarmer = {
      ...response,
      ...response.Farmer,
    };

    setFarmer(newFarmer);
  };

  useEffect(() => {
    getCooperative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coopFarmerId]);

  if (!farmer || !farmer.id) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit coop farmer"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Farmers', href: paths.dashboard.cooperative.coopFarmers },
          { name: 'Edit Coop Farmer' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CoopFarmerNewEditForm currentUser={farmer} />
    </DashboardContent>
  );
}
