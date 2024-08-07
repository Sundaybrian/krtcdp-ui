import { CONFIG } from 'src/config-global';

import { ValueChainCreateView } from 'src/sections/valuechain/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Add new value chain | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ValueChainCreateView />;
}
