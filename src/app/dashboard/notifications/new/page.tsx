import { CONFIG } from 'src/config-global';

import { NotificationCreateView } from 'src/sections/notification/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Notification | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <NotificationCreateView />;
}
