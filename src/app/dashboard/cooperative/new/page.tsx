import { CONFIG } from 'src/config-global';

import { CooperateCreateView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new Cooperative | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CooperateCreateView />;
}
