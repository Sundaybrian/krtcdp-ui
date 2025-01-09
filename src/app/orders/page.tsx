import Container from '@mui/material/Container';

import { CONFIG } from 'src/config-global';

import { MyOrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export const metadata = { title: `My orders - ${CONFIG.site.name}` };

export default async function Page() {
  return (
    <Container sx={{ mb: 15 }}>
      <MyOrderListView />
    </Container>
  );
}
