'use client';

import type { WarehouseReceipt } from 'src/types/farm';
import type { IProductTableFilters } from 'src/types/product';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
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
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE, INSURANCE_TYPE_OPTIONS } from 'src/utils/default';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { searchWarehouseReceipts } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CooperativeTableToolbar } from '../cooperative-table-toolbar';
import { CooperativeTableFiltersResult } from '../cooperative-table-filters-result';
import {
  RenderDate,
  RenderGeneric,
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderHasInsurance,
  RenderCellCreatedAt,
  RenderInsuranceProvidere,
} from '../coop-farmer-table-row';
// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const HIDE_COLUMNS = {
  expectedStorageDuration: false,
  remarks: false,
  warehouseLicense: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['warehouseName', 'depositorName', 'actions'];

// ----------------------------------------------------------------------

export function WarehouseReceiptListView() {
  const confirmRows = useBoolean();
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const router = useRouter();

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });

  const [tableData, setTableData] = useState<WarehouseReceipt[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    searchWarehouseReceipts().then((data) => {
      if (data.results.length) {
        setTableData(data.results);
      }
    });
  }, []);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

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
      router.push(paths.dashboard.cooperative.details(id));
    },
    [router]
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

  const columns: GridColDef[] = [
    {
      field: 'warehouseName',
      headerName: 'Warehouse Name',
      flex: 1,
      minWidth: 8,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'warehouseLocation',
      headerName: 'Warehouse Location',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'warehouseContact',
      headerName: 'Warehouse Contact',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'warehouseLicense',
      headerName: 'Warehouse License',
      width: 160,
      type: 'singleSelect',
      valueOptions: INSURANCE_TYPE_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: 'warehouseOwner',
      headerName: 'Warehouse Owner',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'depositorName',
      headerName: 'Depositor Name',
      width: 110,
      type: 'singleSelect',
      editable: true,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },

    {
      field: 'depositorContact',
      headerName: 'Depositor Contact',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderGeneric params={params} key="county" />,
    },

    {
      field: 'depositorType',
      headerName: 'Depositor Type',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderGeneric params={params} key="subCounty" />,
    },

    {
      field: 'receiptNumber',
      headerName: 'Receipt Number',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderHasInsurance params={params} />,
    },

    {
      field: 'commodityType',
      headerName: 'Commodity Type',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderInsuranceProvidere params={params} />,
    },

    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'unitOfMeasurement',
      headerName: 'Unit',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'qualityGrade',
      headerName: 'Grade',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'storageStartDate',
      headerName: 'storage StartDate',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderDate params={params} />,
    },

    {
      field: 'expectedStorageDuration',
      headerName: 'Duration',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'storageRate',
      headerName: 'Rate',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
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
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Warehouse', href: paths.dashboard.farner.warehouse },
            { name: 'Warehouse Receipts' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.farner.newWarehouse}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Receipt
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
            loading={false}
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
        <CooperativeTableToolbar
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
        <CooperativeTableFiltersResult
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
  inputData: WarehouseReceipt[];
  filters: IProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.warehouseName));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.warehouseLocation));
  }

  return inputData;
}
