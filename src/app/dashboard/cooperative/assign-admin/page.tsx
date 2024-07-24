import { CONFIG } from 'src/config-global';

import { AssignAdminCreateView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Assign Admin To Cooperative | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <AssignAdminCreateView />;
}
