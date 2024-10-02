import { CONFIG } from 'src/config-global';

import { MyCooperativeListView } from 'src/sections/cooperative/union/view';

// ----------------------------------------------------------------------

export const metadata = { title: `My Cooperatives | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <MyCooperativeListView />;
}
