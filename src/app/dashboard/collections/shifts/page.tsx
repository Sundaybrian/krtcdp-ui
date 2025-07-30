import { CONFIG } from 'src/config-global';

import { CollectionsListView } from 'src/sections/shifts/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Shift | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CollectionsListView />;
}
