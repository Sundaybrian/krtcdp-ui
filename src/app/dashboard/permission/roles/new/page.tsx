import { CONFIG } from 'src/config-global';

import { RoleCreateView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Role | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <RoleCreateView />;
}
