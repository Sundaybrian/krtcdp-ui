import { CONFIG } from 'src/config-global';

import { PriceConfigCreateView } from 'src/sections/price-config/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Configuration | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <PriceConfigCreateView />;
}
