import { CONFIG } from 'src/config-global';

import { CollectionsListView } from 'src/sections/collectors/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Collectors | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CollectionsListView />;
}
