import { CONFIG } from 'src/config-global';

import { RouteCreateView } from 'src/sections/routes/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Route | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <RouteCreateView />;
}
