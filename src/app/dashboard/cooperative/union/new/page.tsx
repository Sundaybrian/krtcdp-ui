import { CONFIG } from 'src/config-global';

import { UnionCreateView } from 'src/sections/cooperative/union/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new Union | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UnionCreateView />;
}
