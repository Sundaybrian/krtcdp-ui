import { CONFIG } from 'src/config-global';

import { ValueChainListView } from 'src/sections/valuechain/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cooperative list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ValueChainListView />;
}
// ----------------------------------------------------------------------
