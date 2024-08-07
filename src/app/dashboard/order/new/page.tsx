import { CONFIG } from 'src/config-global';

import { PurchaseOrderCreateView } from 'src/sections/order/view';
// ----------------------------------------------------------------------

export const metadata = { title: `Create a new purchase order | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <PurchaseOrderCreateView />;
}
