import { CONFIG } from 'src/config-global';

import { SubCountyListView } from 'src/sections/county/view';

// ----------------------------------------------------------------------

export const metadata = { title: `County list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <SubCountyListView />;
}
