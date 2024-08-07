import { CONFIG } from 'src/config-global';

import { CategoryListView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Category | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CategoryListView />;
}
