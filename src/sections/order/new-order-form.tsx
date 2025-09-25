'use client';

import type { IProductItem, IProductFilters } from 'src/types/product';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { orderBy } from 'src/utils/helper';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { useSearchProducts } from 'src/actions/product';
import { checkAdvanceAvailableLimit, searchCoopFarmers } from 'src/api/services';
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { AdvaceLimit } from 'src/api/data.inteface';
import { CoopFarmerList } from 'src/types/user';

import { useCheckoutContext } from '../checkout/context';
import { ProductList } from '../product/product-list';
import { ProductSort } from '../product/product-sort';
import { ProductSearch } from '../product/product-search';
import { ProductFilters } from '../product/product-filters';
import { ProductFiltersResult } from '../product/product-filters-result';

import { CheckoutDialog } from './checkout-dialog';

// ----------------------------------------------------------------------

export function OrderNewForm() {
  const checkout = useCheckoutContext();
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('featured');
  const { products } = useSearchProducts({ status: 'PUBLISHED' });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  // Farmer selection state
  const [farmerSearchTerm, setFarmerSearchTerm] = useState('');
  const debouncedFarmerSearch = useDebounce(farmerSearchTerm, 300);
  const [farmerOptions, setFarmerOptions] = useState<any[]>([]);
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [farmerAdvance, setFarmerAdvance] = useState<AdvaceLimit>();

  // Checkout dialog state
  const checkoutDialog = useBoolean();

  const filters = useSetState<IProductFilters>({
    gender: [],
    colors: [],
    rating: '',
    category: 'all',
    priceRange: [0, 200],
  });

  const productSearch = useSearchProducts(debouncedQuery);

  const dataFiltered = applyFilter({ inputData: products, filters: filters.state, sortBy });

  const canReset =
    filters.state.gender.length > 0 ||
    filters.state.colors.length > 0 ||
    filters.state.rating !== '' ||
    filters.state.category !== 'all' ||
    filters.state.priceRange[0] !== 0 ||
    filters.state.priceRange[1] !== 200;

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const productsEmpty = !products.length;

  // Search functions
  const searchFarmers = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setFarmerOptions([]);
        return;
      }

      setFarmerLoading(true);
      try {
        const response = await searchCoopFarmers({
          limit: 20,
          page: 1,
          cooperativeId: state.coopId,
          // name: searchTerm,
          memberNumber: searchTerm,
        });

        const dataRes = await response.results;
        setFarmerOptions(dataRes || []);
      } catch (error) {
        console.error('Error searching farmers:', error);
        setFarmerOptions([]);
      } finally {
        setFarmerLoading(false);
      }
    },
    [state.coopId]
  );

  // Effect for debounced farmer search
  useEffect(() => {
    if (debouncedFarmerSearch) {
      searchFarmers(debouncedFarmerSearch);
    }
  }, [debouncedFarmerSearch, searchFarmers]);

  const getFarmerAdvanceLimit = (farmer: CoopFarmerList) => {
    checkAdvanceAvailableLimit(farmer.id, farmer.Farmer.memberNumber, state.coopId)
      .then((response) => {
        setFarmerAdvance(response);
      })
      .catch((er) => {
        console.log(er);
      });
  };

  const renderFarmerSelection = (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Farmer for Order
      </Typography>
      <Autocomplete
        options={farmerOptions}
        loading={farmerLoading}
        getOptionLabel={(option) =>
          `${option.firstName} ${option.lastName} ${option?.Farmer?.memberNumber}` || ''
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onInputChange={(event, newInputValue) => {
          setFarmerSearchTerm(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedFarmer(newValue);

          // get farmer advance limit
          if (newValue.id) {
            getFarmerAdvanceLimit(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Farmer"
            placeholder="Type to search farmers..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {farmerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Typography variant="body2">
                {option.firstName} {option.middleName || ''} {option.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {option.id} | Phone: {option.mobilePhone || 'N/A'}
              </Typography>
            </Box>
          </Box>
        )}
      />
      {selectedFarmer ? (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="success.dark">
            ✓ Selected Farmer: {selectedFarmer.firstName} {selectedFarmer.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {selectedFarmer.id} | Phone: {selectedFarmer.mobilePhone || 'N/A'}
          </Typography>
          {farmerAdvance && (
            <Typography
              variant="caption"
              color="primary.main"
              sx={{ display: 'block', mt: 1, fontWeight: 'medium' }}
            >
              Available Advance: KES {farmerAdvance.availableAdvance?.toLocaleString() || 0}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="warning.dark">
            ⚠️ Please select a farmer before adding products to cart
          </Typography>
        </Box>
      )}
    </Card>
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={productSearch.products}
        onSearch={handleSearch}
        loading={productSearch.productsLoading}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            genders: PRODUCT_GENDER_OPTIONS,
            categories: ['all', ...PRODUCT_CATEGORY_OPTIONS],
          }}
        />

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3 }}>
        {checkout.totalItems > 0 && selectedFarmer && (
          <Button
            variant="contained"
            size="large"
            onClick={checkoutDialog.onTrue}
            startIcon={<Iconify icon="solar:cart-check-bold" />}
          >
            Checkout ({checkout.totalItems} items)
          </Button>
        )}
      </Box>

      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Create Order for Farmer
      </Typography>

      {renderFarmerSelection}

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound}

      <ProductList products={dataFiltered} />

      <CheckoutDialog
        open={checkoutDialog.value}
        selectedFarmer={selectedFarmer}
        farmerAdvance={farmerAdvance}
        onClose={checkoutDialog.onFalse}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  filters: IProductFilters;
  inputData: IProductItem[];
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // Sort by
  if (sortBy === 'featured') {
    inputData = orderBy(inputData, ['totalSold'], ['desc']);
  }

  if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    inputData = orderBy(inputData, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    inputData = orderBy(inputData, ['price'], ['asc']);
  }

  // filters
  if (gender.length) {
    inputData = inputData.filter((product) => product.gender.some((i) => gender.includes(i)));
  }

  if (category !== 'all') {
    inputData = inputData.filter((product) => product.category === category);
  }

  if (colors.length) {
    inputData = inputData.filter((product) =>
      product.colors.some((color) => colors.includes(color))
    );
  }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter((product) => product.price >= min && product.price <= max);
  }

  if (rating) {
    inputData = inputData.filter((product) => {
      const convertRating = (value: string) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRatings > convertRating(rating);
    });
  }

  return inputData;
}
