import { CONFIG } from 'src/config-global';

import { NewCoopWareHouseCreateView } from 'src/sections/warehouse/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new Coop Farmer | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <NewCoopWareHouseCreateView />;
}
