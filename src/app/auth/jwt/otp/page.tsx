import { CONFIG } from 'src/config-global';

import { OtpVerify } from 'src/sections/auth/jwt/otp';

// ----------------------------------------------------------------------

export const metadata = { title: `OTP Verification | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return <OtpVerify />;
}
