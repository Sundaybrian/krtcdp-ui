import { CONFIG } from 'src/config-global';

import { ProviderCreateView } from 'src/sections/insurance-provider/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create provider | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ProviderCreateView />;
}
