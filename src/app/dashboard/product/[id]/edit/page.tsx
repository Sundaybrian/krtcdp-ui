import { CONFIG } from 'src/config-global';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;
  return <ProductEditView id={id} />;
}

// ----------------------------------------------------------------------
// /**
//  * [1] Default
//  * Remove [1] and [2] if not using [2]
//  */
// const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

// export { dynamic };

// /**
//  * [2] Static exports
//  * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
//  */
// export async function generateStaticParams() {
//   if (CONFIG.isStaticExport) {
//     const res = await axios.get(endpoints.product.list);

//     return res.data.products.map((product: { id: string }) => ({ id: product.id }));
//   }
//   return [];
// }
