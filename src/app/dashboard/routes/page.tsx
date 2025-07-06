import { CONFIG } from 'src/config-global';

import { RouteListView } from 'src/sections/routes/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Routes | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <RouteListView />;
}
