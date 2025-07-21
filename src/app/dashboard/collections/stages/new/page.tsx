import { CONFIG } from 'src/config-global';

import { StageCreateView } from 'src/sections/stages/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Stage | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <StageCreateView />;
}
