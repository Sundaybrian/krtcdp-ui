'use client';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { fDateTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { useGetProduct } from 'src/actions/cooperative';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CartIcon } from '../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function ProductShopDetailsView({ id }: Props) {
  const { product } = useGetProduct(id);

  const checkout = useCheckoutContext();

  const tabs = useTabs('info');

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: paths.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={product?.images} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && (
            <ProductDetailsSummary
              product={product}
              items={checkout.items}
              onAddCart={checkout.onAddToCart}
              onGotoStep={checkout.onGotoStep}
              disableActions={!product?.minStockLevel}
            />
          )}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 10 }}
      >
        <Box sx={{ textAlign: 'center', px: 5 }}>
          <Iconify icon="solar:verified-check-bold" width={32} sx={{ color: 'primary.main' }} />

          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
            Brand
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {product?.brand || 'Not available'}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', px: 5 }}>
          <Iconify icon="solar:clock-circle-bold" width={32} sx={{ color: 'primary.main' }} />

          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
            Sale window
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Start Date - End Date
            <Stack direction="row" spacing={1}>
              <Label color="success">{fDateTime(product?.saleStartDate)}</Label>
              <Label color="warning">{fDateTime(product?.saleEndDate)}</Label>
            </Stack>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', px: 5 }}>
          <Iconify icon="solar:map-point-rotate-bold" width={32} sx={{ color: 'primary.main' }} />

          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
            Location
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {product?.location || 'Not available'}
          </Typography>
        </Box>
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'info', label: 'Detailed info' },
            { value: 'description', label: 'Description' },
            { value: 'reviews', label: `Reviews (${product?.reviews.length})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {tabs.value === 'info' && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Detailed info
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={4}>
                <Typography variant="subtitle2">Views:</Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="body2">{product?.viewCount}</Typography>
              </Grid>
              <Grid xs={4}>
                <Typography variant="subtitle2">Brand:</Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="body2">{product?.brand || 'Not available'}</Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">SKU:</Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="body2">{product?.sku || 'Not available'}</Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">Stock Level:</Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="body2">{product?.minStockLevel || 'Not available'}</Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">Unit:</Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="body2">{product?.unit || 'Not available'}</Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">Category:</Typography>
              </Grid>

              <Grid xs={8}>
                <Typography variant="body2">{product?.category || 'Not available'}</Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">Product Category:</Typography>
              </Grid>

              <Grid xs={8}>
                <Typography variant="body2">
                  {product?.Category?.categoryName || 'Not available'}
                </Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">Product sub category:</Typography>
              </Grid>

              <Grid xs={8}>
                <Typography variant="body2">
                  {product?.SubCategory?.subcategoryName || 'Not available'}
                </Typography>
              </Grid>

              <Grid xs={4}>
                <Typography variant="subtitle2">Tags:</Typography>
              </Grid>
              <Grid xs={8}>
                <Stack direction="row" spacing={1}>
                  {product?.tags?.map((tag) => (
                    <Label key={tag} color="success" sx={{ mx: 0.5 }}>
                      {tag}
                    </Label>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabs.value === 'reviews' && (
          <ProductDetailsReview
            ratings={product?.ratings}
            reviews={product?.reviews}
            totalRating={product?.reviews.reduce((prev, curr) => prev + curr.rating, 0) || 0}
            totalRatings={product?.reviews.length || 0}
            totalReviews={product?.reviews?.length || 0}
          />
        )}
      </Card>
    </Container>
  );
}
