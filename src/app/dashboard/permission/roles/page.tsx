import { CONFIG } from 'src/config-global';

import { RoleListView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Roles | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <RoleListView />;
}
