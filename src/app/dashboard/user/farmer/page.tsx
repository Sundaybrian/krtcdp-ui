import { CONFIG } from 'src/config-global';

import { FarmerListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Farmers list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <FarmerListView />;
}
