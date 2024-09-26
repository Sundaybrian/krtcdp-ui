import { CONFIG } from 'src/config-global';

import { BankPaymentListView } from 'src/sections/payments/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Naration list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BankPaymentListView />;
}