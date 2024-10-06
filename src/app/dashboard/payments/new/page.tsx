import { CONFIG } from 'src/config-global';

import { BnakUploadCreateView } from 'src/sections/finance/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new invoice | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BnakUploadCreateView />;
}
