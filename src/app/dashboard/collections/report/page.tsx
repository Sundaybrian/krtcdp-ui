import { CONFIG } from 'src/config-global';

import { CollectionsListView } from 'src/sections/collection-report/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Report | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CollectionsListView />;
}
