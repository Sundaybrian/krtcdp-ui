import { CONFIG } from 'src/config-global';

import { CountyListView } from 'src/sections/county/view';

// ----------------------------------------------------------------------

export const metadata = { title: `County list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CountyListView />;
}
