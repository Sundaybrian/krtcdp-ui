'use client';

import type { RouteItem } from 'src/types/notification';
import type { IProductTableFilters } from 'src/types/product';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { Field, Form } from 'src/components/hook-form';

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

import { Box, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { requiredPermissions, TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';
import { useSearchAdmins } from 'src/actions/user';
import {
  assignCollectorToRoute,
  assignFarmerToRoute,
  createMilkTask,
  searchCoopFarmers,
} from 'src/api/services';
import { CoopFarmerList } from 'src/types/user';
import { useSearchCollections, useSearchMilkAggregation } from 'src/actions/collections';

// import { TicketViewDialog } from './collection-view-dialog';
import { CooperativeTableToolbar, Ifilter } from '../collectors-table-toolbar';
import { CooperativeTableFiltersResult } from '../collectors-table-filters-result';
import {
  RenderAgent,
  RenderGeneric,
  RenderCreatedAt,
  RenderCellStatus,
  RenderCellProduct,
  RenderTasks,
  RenderRoute,
  RenderCollectionTime,
} from '../collectors-table-row';
import { AggregationVerifyDialog } from './collectors-view-dialog';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const HIDE_COLUMNS = {
  whoPays: false,
  pestorDiseaseName: false,
  description: false,
  cropAnimalName: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export type CollectorSchemaType = zod.infer<typeof CollectorSchema>;

export const CollectorSchema = zod.object({
  routeId: zod.number().optional(),
  collectorId: zod.any().optional(),
  farmerId: zod.any().optional(),
});

// ----------------------------------------------------------------------

export function CollectionsListView() {
  const confirmRows = useBoolean();
  const farmerAssign = useBoolean();
  const verifyDialog = useBoolean();

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const perms = getStorage('permissions');

  const router = useRouter();

  const { searchResults, searchLoading } = useSearchMilkAggregation({
    cooperativeId: state.coopId,
  });

  const filters = useSetState<Ifilter>({ publish: [], stock: [], startDate: null, endDate: null });

  const [tableData, setTableData] = useState<RouteItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const [dialogData, setDialogData] = useState<{ item: any; status: string }>();

  useEffect(() => {
    if (searchResults.length) {
      setTableData(searchResults);
    }
  }, [searchResults]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const handleDeleteRow = useCallback(
    (id: any) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id!));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.cooperative.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      // navigate to collection details
      router.push(paths.dashboard.collections.details(id));
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

  const methods = useForm<CollectorSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(CollectorSchema),
    defaultValues: {
      routeId: 0,
      collectorId: 0,
    },
  });

  const fMethods = useForm<CollectorSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(CollectorSchema),
    defaultValues: {
      routeId: 0,
      farmerId: 0,
    },
  });

  const handleAssignCollector = async () => {
    const { collectorId } = methods.getValues();

    if (!collectorId) {
      toast.error('Please select a collector');
      return;
    }

    const selectedRows = tableData.filter((row) => selectedRowIds.includes(row.id!));
    if (selectedRows.length === 0) {
      toast.error('Please select at least one route');
      return;
    }

    try {
      await assignCollectorToRoute({
        collectorId: Number(collectorId.id),
        routeId: selectedRows.map((row) => row.id!)[0],
      });
      console.log('Assigning collector:', collectorId, 'to routes:', selectedRows);
      confirmRows.onFalse();
      // clear selected rows
      setSelectedRowIds([]);
      methods.reset();
      toast.success('Collector assigned successfully');
    } catch (error) {
      console.error('Error assigning collector:', error);
      toast.error(error.message || 'Failed to assign collector:');
    }
  };

  // handle farmer assign
  const handleAssignFarmer = async () => {
    const { farmerId } = fMethods.getValues();
    if (!farmerId) {
      toast.error('Please select a farmer');
      return;
    }
    const selectedRows = tableData.filter((row) => selectedRowIds.includes(row.id!));
    if (selectedRows.length === 0) {
      toast.error('Please select at least one route');
      return;
    }
    try {
      await assignFarmerToRoute({
        farmerId: Number(farmerId.id),
        routeId: selectedRows.map((row) => row.id!)[0],
      });
      console.log('Assigning farmer:', farmerId, 'to routes:', selectedRows);
      farmerAssign.onFalse();
      // clear selected rows
      setSelectedRowIds([]);
      fMethods.reset();
      toast.success('Farmer assigned successfully');
    } catch (error) {
      console.error('Error assigning farmer:', error);
      toast.error(error.message || 'Failed to assign farmer:');
    }
  };

  const handleMilkTask = async (routeId: number) => {
    if (!routeId) {
      toast.error('Please select a route');
      return;
    }

    try {
      await createMilkTask(routeId);
      toast.success('Milk task created successfully');

      // fetch task
    } catch (error) {
      console.error('Error creating milk task:', error);
      toast.error(error.message || 'Failed to create milk task');
    }
  };

  //  handle permission
  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.tickets.viewTicket) === false && !isSuperAdmin) {
    return <PermissionDeniedView permission="viewTicket" />;
  }

  const columns: GridColDef[] = [
    {
      field: 'collector',
      headerName: 'Collector',
      // flex: 1,
      maxWidth: 180,
      width: 150,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },

    {
      field: 'shift',
      headerName: 'Shift',
      width: 160,
      renderCell: (params) => <RenderTasks params={params} />,
    },
    {
      field: 'route',
      headerName: 'Route',
      width: 160,
      renderCell: (params) => <RenderRoute params={params} />,
    },
    {
      field: 'collections',
      headerName: 'Collections',
      width: 160,
      renderCell: (params) => <RenderAgent params={params} />,
    },

    {
      field: 'totalQuantity',
      headerName: 'Quantity (Kg)',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'aggregationDate',
      headerName: 'Aggregation Date',
      width: 140,
      renderCell: (params) => <RenderCollectionTime params={params} />,
    },
    {
      field: 'totalFarmers',
      headerName: 'Total Farmers',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'containersUsed',
      headerName: 'Containers Used',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'rejectedQuantity',
      headerName: 'Rejected Quantity',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'spillageQuantity',
      headerName: 'Spillage Quantity',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'finalApprovedQuantity',
      headerName: 'Final Approved Quantity',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },

    {
      field: 'verificationNotes',
      headerName: 'Notes',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'creationDate',
      headerName: 'Creation Date',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderCreatedAt params={params} />,
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
          label="View collections"
          onClick={() => {
            handleViewRow(params.row.collectorId);
          }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify color="green" icon="solar:check-circle-bold" />}
          label="Verify"
          onClick={() => {
            verifyDialog.onTrue();
            setDialogData({
              item: params.row,
              status: 'VERIFIED',
            });
          }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Verify with Adjustment"
          onClick={() => {
            verifyDialog.onTrue();
            setDialogData({
              item: params.row,
              status: 'VERIFIED_WITH_ADJUSTMENT',
            });
          }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:card-search-bold" />}
          label="Mark for Review"
          onClick={() => {
            verifyDialog.onTrue();
            setDialogData({
              item: params.row,
              status: 'REQUIRES_REVIEW',
            });
          }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify color="red" icon="solar:close-circle-bold" />}
          label="Reject"
          color="error"
          onClick={() => {
            verifyDialog.onTrue();
            setDialogData({
              item: params.row,
              status: 'REJECTED',
            });
          }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:checklist-minimalistic-bold" />}
          label="View allocations"
          onClick={() => {
            router.push(paths.dashboard.collections.allocations(params.row.collectorId));
          }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Aggregated Collections"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Collections', href: paths.dashboard.collections.routes.root },
          { name: 'Listed Collections' },
        ]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.dashboard.collections.routes.new}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     New
        //   </Button>
        // }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          // height: { xs: 800, md: 2 },
          flexDirection: { md: 'column' },
        }}
      >
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={dataFiltered}
          columns={columns}
          loading={searchLoading}
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

      <AggregationVerifyDialog
        onClose={verifyDialog.onFalse}
        open={verifyDialog.value}
        data={dialogData!}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  filters: UseSetStateReturn<Ifilter>;
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
  inputData: RouteItem[];
  filters: IProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.name));
  }

  return inputData;
}
