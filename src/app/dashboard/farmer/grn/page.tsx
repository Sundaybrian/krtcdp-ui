import { CONFIG } from 'src/config-global';

import { GrnListView } from 'src/sections/grn/view';

// ----------------------------------------------------------------------

export const metadata = { title: `GRN list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <GrnListView />;
}
