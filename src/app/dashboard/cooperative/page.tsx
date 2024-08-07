import { CONFIG } from 'src/config-global';

import { CooperativeListView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cooperative list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CooperativeListView />;
}
