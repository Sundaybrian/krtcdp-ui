import { CONFIG } from 'src/config-global';

import { NotificationCreateView } from 'src/sections/tickets/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Ticket | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <NotificationCreateView />;
}
