import { CONFIG } from 'src/config-global';

import { UserRoleListView } from 'src/sections/user-role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User Roles | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UserRoleListView />;
}
