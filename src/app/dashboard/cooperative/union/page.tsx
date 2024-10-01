import { CONFIG } from 'src/config-global';

import { UnionListView } from 'src/sections/cooperative/union/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cooperative Unions | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UnionListView />;
}
