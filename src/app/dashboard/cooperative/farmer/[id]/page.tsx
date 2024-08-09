// import { DashboardContent } from 'src/layouts/dashboard';

// export default function ViewFarmer() {
//   return (
//     <>
//       <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {/* <FarmerView /> */}
//         <div>Farmer View</div>
//       </DashboardContent>
//     </>
//   );
// }

'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AccountBilling } from 'src/sections/account/account-billing';
import { AccountChangePassword } from 'src/sections/account/account-change-password';
import { AccountGeneral } from 'src/sections/account/account-general';
import { AccountNotifications } from 'src/sections/account/account-notifications';
import { AccountSocialLinks } from 'src/sections/account/account-social-links';
import { useEffect, useState } from 'react';
import {
  getFarmerById,
  getUserById,
  searchFarmValueChain,
  searchFarms,
  searchHarvests,
} from 'src/api/services';
import { CoopFarmerList, IUserItem, UserAccount } from 'src/types/user';
import { FarmerAccountGeneral } from 'src/sections/farmer/account-general';
import { useSearchFarms } from 'src/actions/farm';
import { NotFoundView } from 'src/sections/error';
import { Farms } from 'src/sections/farmer/farm';
import { Harvest } from 'src/types/farm';
import { FarmerHarvest } from 'src/sections/farmer/harvest';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';
import { EmptyContent } from 'src/components/empty-content';
import { ValueChain } from 'src/types/value-chain';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  { value: 'billing', label: 'Farms', icon: <Iconify icon="solar:bill-list-bold" width={24} /> },
  {
    value: 'harvests',
    label: 'Harvests',
    icon: <Iconify icon="solar:snowflake-bold" width={24} />,
  },
  // { value: 'security', label: 'Security', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
];

// ----------------------------------------------------------------------

type Props = {
  params: { id: string; tab: string };
  searchParams: { tab: string };
};

export default function FarmerAccountView({ params, searchParams }: Props) {
  const { id } = params;
  const { tab } = searchParams;
  const tabs = useTabs(tab || 'general');

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: null });
  const [farmer, setFarmer] = useState<CoopFarmerList>({} as any);
  const [farms, setFarms] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [valueChains, setFarmValueChain] = useState<ValueChain[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<number>();

  const getFarms = () => {
    searchFarms({ userId: Number(id) })
      .then((res) => {
        setFarms(res.results);
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Failed to fetch farms');
      });
  };

  const getHarvests = () => {
    searchHarvests({ cooperativeId: Number(state.coopId), farmerId: Number(id) })
      .then((res) => {
        setHarvests(res.results);
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Failed to fetch harvests');
      });
  };

  const getFarmValueChain = () => {
    searchFarmValueChain({ farmId: selectedFarm })
      .then((res) => {
        console.log(res, 'ValueChain');

        setFarmValueChain(res.results);
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Failed to fetch value chain');
      });
  };

  useEffect(() => {
    getFarmerById(Number(id))
      .then((res) => {
        setFarmer(res);
      })
      .catch((err) => {
        console.log('err', err);
        throw new Error('Farmer not found');
      });

    getFarms();
    getHarvests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.coopId]);

  useEffect(() => {
    getFarmValueChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Farmer Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Farmers', href: paths.dashboard.user.root },
          { name: 'Farmer' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && farmer.id && (
        <FarmerAccountGeneral coopId={Number(state.coopId)} farmer={farmer} />
      )}

      {tabs.value === 'billing' && (
        <Farms
          farms={farms}
          onSelectFarm={(farmerId) => {
            setSelectedFarm(farmerId);
          }}
          cards={_userPayment}
          valueChains={valueChains}
          addressBook={_userAddressBook}
        />
      )}

      {tabs.value === 'harvests' && (
        <>
          {!harvests.length && (
            <EmptyContent
              filled
              title="No harvests recorded"
              sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
            />
          )}

          {harvests.map((harvest) => (
            <FarmerHarvest key={harvest.id} harvest={harvest} />
          ))}
        </>
      )}

      {/* {tabs.value === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />} */}

      {/* {tabs.value === 'security' && <AccountChangePassword />} */}
    </DashboardContent>
  );
}
