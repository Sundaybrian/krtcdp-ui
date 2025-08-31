'use client';

import type { RouteItem } from 'src/types/notification';
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

import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { Box, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { exportExcel } from 'src/utils/xlsx';
import { removeKeyFromArr } from 'src/utils/helper';
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
  searchCollections,
  searchCoopFarmers,
} from 'src/api/services';
import { CoopFarmerList } from 'src/types/user';
import { useSearchCollections } from 'src/actions/collections';

// import { TicketViewDialog } from './collection-view-dialog';
import { CooperativeTableToolbar, Ifilter } from '../collection-table-toolbar';
import { CooperativeTableFiltersResult } from '../collection-table-filters-result';
import {
  RenderAgent,
  RenderGeneric,
  RenderCreatedAt,
  RenderCellStatus,
  RenderCellProduct,
  RenderTasks,
  RenderRoute,
  RenderCollectionTime,
} from '../collection-table-row';
import { FilterDialog } from './filter-dialog';
import { AdjustQuantityDialog } from './adjust-quantity-dialog';
import { TransferCollectionDialog } from './transfer-collection-dialog';

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

export type PageData = {
  total: number;
  limit: number;
  page: number;
};

// ----------------------------------------------------------------------

export function CollectionsListView() {
  const confirmRows = useBoolean();
  const quantityDialog = useBoolean();
  const tranferDialog = useBoolean();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<PageData>({
    limit: 20,
    page: 1,
    total: 0,
  });

  const [dialogData, setDialogData] = useState<any>({ item: '' });

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const perms = getStorage('permissions');

  const router = useRouter();

  const filters = useSetState<Ifilter>({
    publish: [],
    stock: [],
    startDate: null,
    endDate: null,
    collector: undefined,
    shift: undefined,
    route: undefined,
    status: undefined,
    farmer: undefined,
  });

  // Build query object with all filter parameters for API
  const query: any = useMemo(() => {
    const queryObj: any = {};

    if (filters.state.route) {
      queryObj.routeId = filters.state.route;
    }
    if (filters.state.shift) {
      queryObj.shiftId = filters.state.shift;
    }
    if (filters.state.collector) {
      queryObj.collectorId = filters.state.collector;
    }
    if (filters.state.farmer) {
      queryObj.farmerId = filters.state.farmer;
    }
    if (filters.state.startDate) {
      queryObj.collectionTimeFrom = new Date(filters.state.startDate).toISOString();
    }
    if (filters.state.endDate) {
      queryObj.collectionTimeTo = new Date(filters.state.endDate).toISOString();
    }
    if (filters.state.status) {
      queryObj.status = filters.state.status;
    }

    return queryObj;
  }, [
    filters.state.route,
    filters.state.shift,
    filters.state.collector,
    filters.state.farmer,
    filters.state.startDate,
    filters.state.endDate,
    filters.state.status,
  ]);

  const [tableData, setTableData] = useState<RouteItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  // Since API returns filtered results, we don't need local filtering
  const dataFiltered = tableData;

  const getCollections = useCallback(() => {
    setSearchLoading(true);
    searchCollections({
      cooperativeId: state.coopId,
      ...query,
      page: pageData.page,
      limit: pageData.limit,
    })
      .then((response) => {
        if (response.results) {
          setTableData(response.results);
          setPageData({
            limit: pageData.limit,
            page: pageData.page,
            total: response.totalItems,
          });
        }
      })
      .catch((error) => {
        toast.error(error.message || 'An error occured while fetching collections');
      })
      .finally(() => {
        setSearchLoading(false);
      });
  }, [query, state.coopId, setPageData, pageData.limit, pageData.page]);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  const canReset =
    filters.state.publish.length > 0 ||
    filters.state.stock.length > 0 ||
    !!filters.state.collector ||
    !!filters.state.shift ||
    !!filters.state.route ||
    !!filters.state.status ||
    !!filters.state.farmer ||
    !!filters.state.startDate ||
    !!filters.state.endDate;

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

  // handle export
  const handleExport = useCallback(() => {
    const exportData = removeKeyFromArr(dataFiltered, [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'cooperativeId',
      'allocatedById',
      'approvedById',
      'rejectedById',
      'completedById',
      'cancelledById',
      'farmerId',
      'containerId',
      'shiftId',
      'routeId',
      'collectorId',
      'originalRouteId',
      'isAdHocCollection',
      'taskId',
      'stageId',
      'routeAggregationId',
    ]);

    const finalExport = exportData.map((col) => ({
      ...col,
      farmer: `${col?.farmer?.firstName} ${col?.farmer?.lalstName}`,
      collector: `${col?.collector?.firstName} ${col?.collector?.lastName}`,
      container: col?.container?.containerNumber,
      stage: col?.stage?.name,
      shift: col?.shift?.name,
      route: col?.route?.name,
    }));

    exportExcel(finalExport, 'Collections');
  }, [dataFiltered]);

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
        onExport={handleExport}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds, dataFiltered]
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

  //  handle permission
  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.tickets.viewTicket) === false && !isSuperAdmin) {
    return <PermissionDeniedView permission="viewTicket" />;
  }

  const columns: GridColDef[] = [
    {
      field: 'farmer',
      headerName: 'Farmer Name',
      width: 160,
      renderCell: (params) => <RenderTasks params={params} />,
    },
    {
      field: 'collector',
      headerName: 'Collector Name',
      // flex: 1,
      maxWidth: 180,
      width: 150,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },

    {
      field: 'route',
      headerName: 'Route Name',
      width: 160,
      renderCell: (params) => <RenderRoute params={params} />,
    },
    {
      field: 'container',
      headerName: 'Container',
      width: 160,
      renderCell: (params) => <RenderAgent params={params} />,
    },
    {
      field: 'collectionTime',
      headerName: 'Collection Time',
      width: 140,
      renderCell: (params) => <RenderCollectionTime params={params} />,
    },

    {
      field: 'quantity',
      headerName: 'Quantity (KG)',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'temperature',
      headerName: 'Temperature (°C)',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'organolepticTest',
      headerName: 'Organoleptic Test',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'densityReading',
      headerName: 'Density Reading',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'addedWaterPercentage',
      headerName: 'Added Water (%)',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'alcoholTestPassed',
      headerName: 'Alcohol Test Passed',
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'error'}
          size="small"
          variant="soft"
        />
      ),
    },

    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },

    {
      field: 'description',
      headerName: 'Description',
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
          icon={<Iconify color="green" icon="solar:check-circle-bold" />}
          label="Adjust Quantity"
          onClick={() => {
            quantityDialog.onTrue();
            setDialogData({
              item: params.row,
            });
          }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Transfer"
          onClick={() => {
            tranferDialog.onTrue();
            setDialogData({
              item: params.row,
            });
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
        heading="Collections Report"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Collections', href: paths.dashboard.collections.report },
          { name: 'Report' },
        ]}
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
          pageSizeOptions={[10, 20, 40]}
          initialState={{
            pagination: { paginationModel: { pageSize: 20 }, rowCount: pageData.total },
          }}
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
          paginationMode="server"
          rowCount={pageData.total}
          onPaginationModelChange={(newModel) => {
            setPageData((prev) => ({ ...prev, page: newModel.page + 1, limit: newModel.pageSize }));
          }}
          sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
        />
      </Card>
      <AdjustQuantityDialog
        data={dialogData}
        open={quantityDialog.value}
        onClose={() => {
          quantityDialog.onFalse();
        }}
      />

      <TransferCollectionDialog
        data={dialogData}
        open={tranferDialog.value}
        onClose={() => {
          tranferDialog.onFalse();
        }}
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
  onExport: () => void;
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
  onExport,
}: CustomToolbarProps) {
  const filterDialog = useBoolean();

  return (
    <>
      <GridToolbarContainer>
        {/* <GridToolbarQuickFilter /> */}

        {/* Add button for more filter that opens a dialog with status collector and route */}
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="solar:filter-bold" />}
          onClick={filterDialog.onTrue}
        >
          Filters
        </Button>

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

          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="solar:export-bold" />}
            onClick={onExport}
          >
            Export
          </Button>
        </Stack>
      </GridToolbarContainer>

      <FilterDialog open={filterDialog.value} onClose={filterDialog.onFalse} filters={filters} />

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
