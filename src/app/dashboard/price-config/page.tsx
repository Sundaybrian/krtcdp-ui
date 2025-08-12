import { CONFIG } from 'src/config-global';

import { PriceConfigListView } from 'src/sections/price-config/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Price Configuration | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <PriceConfigListView />;
}
