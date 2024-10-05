import { CONFIG } from 'src/config-global';

import { TaskCreateView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Assign Task | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <TaskCreateView />;
}
