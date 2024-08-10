import { getCooperativeById } from 'src/api/services';
import { CONFIG } from 'src/config-global';
import { CooperativeEditView } from 'src/sections/cooperative/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Coop edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  return <CooperativeEditView cooperativeId={id} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  return [];
}
