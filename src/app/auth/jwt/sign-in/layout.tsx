import { CONFIG } from 'src/config-global';
import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthSplitLayout
        section={{
          title: 'Hi, Welcome Back to the CoopHub Portal',
          subtitle: 'Supporting Farmers. Sustaining Kenya.',
          imgUrl: `${CONFIG.site.basePath}/assets/illustrations/farm-one.png`,
        }}
      >
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
