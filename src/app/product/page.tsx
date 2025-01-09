import { CONFIG } from 'src/config-global';

import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product Marketplace - ${CONFIG.site.name}` };

export default async function Page() {
  return <ProductShopView />;
}
