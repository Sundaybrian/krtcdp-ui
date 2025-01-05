import { CONFIG } from 'src/config-global';

import { TicketListView } from 'src/sections/tickets/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Tickets | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <TicketListView />;
}
