import { CONFIG } from 'src/config-global';

import { TasksListView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Tasks | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <TasksListView />;
}
