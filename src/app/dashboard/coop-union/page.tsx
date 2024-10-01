import { CONFIG } from 'src/config-global';

import { MyUnionListView } from 'src/sections/cooperative/union/view';

// ----------------------------------------------------------------------

export const metadata = { title: `My Unions | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <MyUnionListView />;
}
