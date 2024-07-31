import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';
import { getProduct } from 'src/actions/product-ssr';

import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product details - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const { product } = await getProduct(id);

  product.name = [
    'Fertilizer spreaders',
    'Harrows',
    'Tractor',
    'Baler',
    'Wheelbarrow',
    'Cultivator',
    'Seed Tender',
    'Pruner',
    'Combine Harverster',
    'Potato Digger',
    'Sprayer',
    'Plow',
    'Seeder',
    'Mower',
    'Tedder',
    'Loader',
    'Rake',
    'Sprinkler',
    'Maize',
    'Wheat',
    'Rice',
    'Soybean',
    'Cotton',
    'Sugarcane',
  ][Math.floor(Math.random() * 21)];

  product.price = Math.ceil(Math.random() * 100000);

  product.coverUrl = `../assets/farm/${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17][Math.floor(Math.random() * 18)]}.avif`;

  // generate an array of 5 random number from 1 to 4
  const arr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4) + 1);
  product.images = arr.map((index) => {
    return `../../assets/farm/${index}.avif`;
  });

  return <ProductShopDetailsView product={product} />;
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
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.product.list);
    return res.data.products.map((product: { id: string }) => ({ id: product.id }));
  }
  return [];
}
