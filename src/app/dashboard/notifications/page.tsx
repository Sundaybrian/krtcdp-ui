import { CONFIG } from 'src/config-global';

import { NotificationListView } from 'src/sections/notification/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Notifications | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <NotificationListView />;
}
