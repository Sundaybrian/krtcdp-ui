import { CONFIG } from 'src/config-global';

import { WarehouseReceiptListView } from 'src/sections/warehouse/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Farmer list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <WarehouseReceiptListView />;
}
