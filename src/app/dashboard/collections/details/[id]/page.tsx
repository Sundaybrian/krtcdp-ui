import { CONFIG } from 'src/config-global';

import { CollectionsListView } from 'src/sections/collections/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Collections | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CollectionsListView />;
}
