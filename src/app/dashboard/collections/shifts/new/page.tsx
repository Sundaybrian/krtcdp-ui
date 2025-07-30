import { CONFIG } from 'src/config-global';

import { RouteCreateView } from 'src/sections/shifts/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Shift | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <RouteCreateView />;
}
