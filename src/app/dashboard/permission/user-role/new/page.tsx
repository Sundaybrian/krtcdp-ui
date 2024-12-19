import { CONFIG } from 'src/config-global';

import { UserRoleCreateView } from 'src/sections/user-role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New User Role | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UserRoleCreateView />;
}
