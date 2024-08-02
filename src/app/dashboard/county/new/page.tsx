import { CONFIG } from 'src/config-global';

import { CountyCreateView } from 'src/sections/county/view';
// ----------------------------------------------------------------------

export const metadata = { title: `Create a new county | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CountyCreateView />;
}
