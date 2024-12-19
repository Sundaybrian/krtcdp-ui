import { CONFIG } from 'src/config-global';

import { PermissionListView } from 'src/sections/role-permission/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Permissions | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <PermissionListView />;
}
