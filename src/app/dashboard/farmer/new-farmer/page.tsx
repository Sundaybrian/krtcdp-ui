import { CONFIG } from 'src/config-global';

import { NewCoopFarmerCreateView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new Coop Farmer | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <NewCoopFarmerCreateView />;
}
