import { CONFIG } from 'src/config-global';

import { DeductionListView } from 'src/sections/finance/deduction/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Deductions | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <DeductionListView />;
}
