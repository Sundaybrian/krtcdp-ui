import { CONFIG } from 'src/config-global';

import { EditCoopFarmerCreateView } from 'src/sections/cooperative/view/edit-coop-farmer';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit Coop Farmer | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <EditCoopFarmerCreateView />;
}
