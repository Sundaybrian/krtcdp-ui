import { CONFIG } from 'src/config-global';

import { CollectionsListView } from 'src/sections/milk-allocation/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Milk Allocations | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CollectionsListView />;
}
