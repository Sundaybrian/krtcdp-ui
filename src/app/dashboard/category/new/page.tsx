import { CONFIG } from 'src/config-global';

import { CategoryCreateView } from 'src/sections/category/view';
// ----------------------------------------------------------------------

export const metadata = { title: `Create a new county | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CategoryCreateView />;
}
