import { CONFIG } from 'src/config-global';

import { StageListView } from 'src/sections/stages/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Stages | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <StageListView />;
}
