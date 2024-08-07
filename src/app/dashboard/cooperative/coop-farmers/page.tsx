import { CONFIG } from 'src/config-global';

import { CooperativeFarmerListView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cooperative list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CooperativeFarmerListView />;
}
