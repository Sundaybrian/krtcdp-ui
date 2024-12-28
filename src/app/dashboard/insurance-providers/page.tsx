import { CONFIG } from 'src/config-global';

import { InsuranceProviderListView } from 'src/sections/insurance-provider/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Insurance providers | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <InsuranceProviderListView />;
}
