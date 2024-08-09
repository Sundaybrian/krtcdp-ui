import { CONFIG } from 'src/config-global';

import { HarvestListView } from 'src/sections/harvest/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Farmer list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <HarvestListView />;
}
