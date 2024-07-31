import { CONFIG } from 'src/config-global';
import { getProducts } from 'src/actions/product-ssr';

import { ProductShopView } from 'src/sections/product/view';
import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

export const metadata = { title: `Product Marketplace - ${CONFIG.site.name}` };

export default async function Page() {
  const { products } = await getProducts();

  products.forEach((product: IProductItem) => {
    product.price = Math.ceil(Math.random() * 100000);
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

    product.coverUrl = `../assets/farm/${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17][Math.floor(Math.random() * 18)]}.avif`;
  });

  return <ProductShopView products={products} />;
}
