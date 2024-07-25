import { CONFIG } from 'src/config-global';

import { CooperativeAdminListView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cooperative Admins | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CooperativeAdminListView />;
}
