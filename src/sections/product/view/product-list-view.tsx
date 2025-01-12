'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IProductItem, IProductTableFilters } from 'src/types/product';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { getStorage } from 'src/hooks/use-local-storage';

import { fCurrency } from 'src/utils/format-number';
import { requiredPermissions } from 'src/utils/default';

import { updateProduct } from 'src/api/services';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { useSearchProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
import {
  RenderCellCode,
  RenderCellTags,
  RenderCellPrice,
  RenderCellStock,
  RenderCellProduct,
  RenderCellSaleDate,
  RenderCellCooperative,
  RenderProductCategory,
  RenderCellSaleEndDate,
  RenderCellMarketPrice,
  RenderProductSubCategory,
} from '../product-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const HIDE_COLUMNS = { cooperative: false, tags: false };

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export function ProductListView() {
  const confirmRows = useBoolean();
  const onPublish = useBoolean();

  const router = useRouter();
  const perms = getStorage('permissions');

  const { products, productsLoading } = useSearchProducts();

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });

  const [tableData, setTableData] = useState<IProductItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [selectedProduct, setProduct] = useState<IProductItem>({} as any);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handlePublishRow = useCallback(
    (id: string) => {
      const product = tableData.find((row) => row.id === id);
      setProduct(product!);
      onPublish.onTrue();
    },
    [tableData, onPublish]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.product.viewProduct) === false && !isSuperAdmin) {
    return <PermissionDeniedView permission="viewProduct" />;
  }

  const columns: GridColDef[] = [
    // { field: 'category', headerName: 'Category', filterable: false },
    // handleViewRow(params.row.id)
    {
      field: 'name',
      headerName: 'Product',
      flex: 1,
      minWidth: 190,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} onViewRow={() => null} />,
    },

    {
      field: 'cooperative',
      headerName: 'Cooperative',
      width: 160,
      renderCell: (params) => <RenderCellCooperative params={params} />,
    },
    {
      field: 'Category',
      headerName: 'Product Category',
      width: 160,
      renderCell: (params) => <RenderProductCategory params={params} />,
    },
    {
      field: 'SubCategory',
      headerName: 'Product sub-category',
      width: 160,
      renderCell: (params) => <RenderProductSubCategory params={params} />,
    },

    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <RenderCellCode params={params} />,
    },
    {
      field: 'saleStartDate',
      headerName: 'Sale start date',
      width: 160,
      renderCell: (params) => <RenderCellSaleDate params={params} />,
    },
    {
      field: 'saleEndDate',
      headerName: 'Sale end date',
      width: 160,
      renderCell: (params) => <RenderCellSaleEndDate params={params} />,
    },
    {
      field: 'marketPrice',
      headerName: 'Market Price',
      width: 160,
      renderCell: (params) => <RenderCellMarketPrice params={params} />,
    },

    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },

    {
      field: 'minStockLevel',
      headerName: 'Stock',
      width: 160,
      type: 'singleSelect',
      valueOptions: PRODUCT_STOCK_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 110,
      renderCell: (params) => <RenderCellTags params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:archive-up-minimlistic-broken" />}
          label="Publish"
          onClick={() => handlePublishRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  async function handlePublishProducts() {
    try {
      await updateProduct(selectedProduct.id, { status: 'PUBLISHED' });
      toast.success('Product published successfully');
      onPublish.onFalse();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product', href: paths.dashboard.product.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New product
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={onPublish.value}
        onClose={onPublish.onFalse}
        title="Publish"
        content={
          <>
            Are you sure want to publish <strong> {selectedProduct.name} </strong>, Price:{' '}
            <Label>{fCurrency(selectedProduct.price)}</Label>
          </>
        }
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              handlePublishProducts();
            }}
          >
            Publish
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  filters: UseSetStateReturn<IProductTableFilters>;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <GridToolbarQuickFilter />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IProductItem[];
  filters: IProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { stock, publish } = filters;
  console.log('APplying--------');

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}
