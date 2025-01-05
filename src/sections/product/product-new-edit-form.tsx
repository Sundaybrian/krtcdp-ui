import type { IProductItem } from 'src/types/product';
import type { CategoryData } from 'src/types/category';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { VALUE_CHAIN_TYPES, UNIT_OF_MEASUREMENT } from 'src/utils/default';

import { _tags } from 'src/_mock';
import {
  createProduct,
  updateProduct,
  searchCategories,
  uploadProductImage,
} from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  images: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
  stockQuantity: zod.number().min(1, { message: 'Product quantity is required!' }),
  minStockLevel: zod.number().min(1, { message: 'Stock level is required!' }),
  unit: zod.string().min(1, { message: 'Choose at least one option!' }),
  tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  price: zod.number().min(1, { message: 'Price should not be $0.00' }),
  category: zod.string().min(1, { message: 'Category is required!' }),
  categoryId: zod.number().min(1, { message: 'Product category is required!' }),
  subCategoryId: zod.number().min(1, { message: 'Sub-category is required!' }),
  // Not required
  marketPrice: zod.number(),
  taxRate: zod.number(),
  isOnSale: zod.boolean(),
  saleStartDate: zod.any(),
  saleEndDate: zod.any(),
  sku: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      //
      stockQuantity: currentProduct?.stockQuantity || 0,
      sku: currentProduct?.sku || '10',
      price: currentProduct?.price || 0,
      minStockLevel: currentProduct?.minStockLevel || 0,
      marketPrice: currentProduct?.marketPrice || 0,
      tags: currentProduct?.tags || [],
      taxRate: currentProduct?.taxRate || 0,
      unit: currentProduct?.unit || '',
      saleStartDate: currentProduct?.saleStartDate || null,
      saleEndDate: currentProduct?.saleEndDate || null,
      category: currentProduct?.category || '',
      categoryId: currentProduct?.categoryId || ('' as any),
      subCategoryId: currentProduct?.subCategoryId || ('' as any),
      isOnSale: currentProduct?.isOnSale || false,
    }),
    [currentProduct]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  // get product category
  const getCategories = useCallback(() => {
    // get categories
    searchCategories({})
      .then((response) => {
        setCategories(response.results);
      })
      .catch((error) => {
        toast(error.message || 'An error occurred. Please try again later.');
      });
  }, []);

  useEffect(() => {
    getCategories();
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset, getCategories]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxRate', 0);
    } else {
      setValue('taxRate', currentProduct?.taxRate || 0);
    }
  }, [currentProduct?.taxRate, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // format date to iso
      if (data.saleStartDate) {
        data.saleStartDate = new Date(data.saleStartDate).toISOString();
      }
      if (data.saleEndDate) {
        data.saleEndDate = new Date(data.saleEndDate).toISOString();
      }

      if (currentProduct) {
        await updateProduct(currentProduct.id, data);
      } else {
        const product = await createProduct(data);
        // upload product images
        if (data.images && data.images.length > 0) {
          data.images.forEach((image: File | string, index: number) => {
            const formData = new FormData();
            formData.append('image', image);
            if (index === 0) {
              formData.append('isMain', true as any);
            }
            formData.append('sortOrder', (index + 1) as any);

            uploadProductImage(product.id, formData).catch((error) => {
              console.error(error);
              toast.error('Failed to upload product images');
            });
          });
        }
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Product created successfully!');
      // router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const handleCategoryChange = (id: number) => {
    console.log(values);

    const selectedCategory = categories.find((category) => category.id === Number(id));
    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories || []);
    }
  };

  const renderDetails = (
    <Card>
      <CardHeader
        title="Product Details"
        subheader="Title, short description, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Product name" />

        {/* <Field.Text name="subDescription" label="Highlight" multiline rows={4} /> */}

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Detailed description</Typography>
          <Field.Editor
            placeholder="Detailed description"
            name="description"
            sx={{ maxHeight: 480 }}
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader title="Properties" subheader="Additional informmation..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text
            name="stockQuantity"
            label="Stock quantity"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    Qty
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          <Field.Text
            name="minStockLevel"
            label="Stock level"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    Min
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          <Field.Select name="categoryId" label="Product category">
            <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              None
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {categories.map((category) => (
              <MenuItem
                onClick={(e: any) => handleCategoryChange(category.id)}
                key={category.id + category.categoryName}
                value={category.id}
              >
                {category.categoryName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select name="subCategoryId" label="Product sub-category">
            <MenuItem
              value=""
              onClick={() => null}
              sx={{ fontStyle: 'italic', color: 'text.secondary' }}
            >
              None
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {subCategories.map((county) => (
              <MenuItem key={county.id + county.subcategoryName} value={county.id}>
                {county.subcategoryName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select name="unit" label="Units eg Litres">
            <MenuItem
              value=""
              onClick={() => null}
              sx={{ fontStyle: 'italic', color: 'text.secondary' }}
            >
              None
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {UNIT_OF_MEASUREMENT.map((county) => (
              <MenuItem key={county} value={county}>
                {county}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select name="category" label="Category eg CROPS">
            <MenuItem
              value=""
              onClick={() => null}
              sx={{ fontStyle: 'italic', color: 'text.secondary' }}
            >
              None
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {VALUE_CHAIN_TYPES.map((county) => (
              <MenuItem key={county} value={county}>
                {county}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Field.Autocomplete
          name="tags"
          label="Tags"
          placeholder="+ Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
          <Field.Text
            name="saleLabel.content"
            label="Sale label"
            fullWidth
            disabled={!values.saleLabel.enabled}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
          <Field.Text
            name="newLabel.content"
            label="New label"
            fullWidth
            disabled={!values.newLabel.enabled}
          />
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader title="Pricing" subheader="Price related inputs" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="marketPrice"
          label="Market price"
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  Ksh
                </Box>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="price"
          label="Sale price"
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  Ksh
                </Box>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Switch id="toggle-taxes" checked={includeTaxes} onChange={handleChangeIncludeTaxes} />
          }
          label="Price includes taxes"
        />

        {!includeTaxes && (
          <Field.Text
            name="taxRate"
            label="Tax (%)"
            placeholder="0.00"
            type="number"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    %
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>
    </Card>
  );

  const renderSaleInfo = (
    <Card>
      <CardHeader title="Sale Window" subheader="Product sale availability" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.DatePicker name="saleStartDate" label="Start Date" />

        <Field.DatePicker name="saleEndDate" label="End Date" />

        <FormControlLabel
          name="isOnSale"
          control={<Switch id="toggle-onsale" checked={values.isOnSale} />}
          label="On sale"
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton
        onClick={(e) => {
          console.log(e);
          console.log(values);
          console.log(errors);
        }}
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
      >
        {!currentProduct ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderSaleInfo}

        {renderActions}
      </Stack>
    </Form>
  );
}
