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

import { useState, useEffect, useCallback, useMemo } from 'react';

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
  });

  const query: any = {};
  if (filters.state.route) {
    query.routeId = filters.state.route;
  }
  if (filters.state.shift) {
    query.shiftId = filters.state.shift;
  }
  if (filters.state.startDate) {
    query.collectionTimeFrom = new Date(filters.state.startDate).toISOString();
  }

  if (filters.state.endDate) {
    query.collectionTimeTo = new Date(filters.state.endDate).toISOString();
  }

  if (filters.state.status) {
    query.status = filters.state.status;
  }

  console.log(filters.state, 'Filters');

  const { searchResults, searchLoading } = useSearchCollections({
    cooperativeId: state.coopId,
    ...query,
  });

  const [tableData, setTableData] = useState<RouteItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const dataFiltered = useMemo(
    () => applyFilter({ inputData: tableData, filters: filters.state }),
    [tableData, filters.state]
  );

  useEffect(() => {
    if (searchResults.length) {
      setTableData(searchResults);
    }
  }, [searchResults, state.coopId, filters]);

  const canReset =
    filters.state.publish.length > 0 ||
    filters.state.stock.length > 0 ||
    !!filters.state.collector ||
    !!filters.state.shift ||
    !!filters.state.route ||
    !!filters.state.status ||
    !!filters.state.startDate ||
    !!filters.state.endDate;

  console.log(dataFiltered, 'dataFilter');

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
      field: 'farmer',
      headerName: 'Farmer Name',
      width: 160,
      renderCell: (params) => <RenderTasks params={params} />,
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
      headerName: 'Quantity (L)',
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
      getActions: (params) => [],
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
        <GridToolbarQuickFilter />

        {/* Add button for more filter that opens a dialog with status collector and route */}
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="solar:filter-bold" />}
          onClick={filterDialog.onTrue}
        >
          More Filters
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

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: RouteItem[];
  filters: Ifilter;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  let filteredData: any = inputData;

  // Filter by collector
  if (filters.collector) {
    filteredData = filteredData.filter((item: any) => item.collectorId === filters.collector);
  }

  // Filter by shift
  if (filters.shift) {
    filteredData = filteredData.filter((item: any) => item.shiftId === filters.shift);
  }

  // Filter by route
  if (filters.route) {
    filteredData = filteredData.filter((item: any) => item.routeId === filters.route);
  }

  // Filter by status
  if (filters.status) {
    filteredData = filteredData.filter((item: any) => item.status === filters.status);
  }

  // Filter by start date
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredData = filteredData.filter((item: any) => {
      const itemDate = new Date(item.createdAt || item.creationDate);
      return itemDate >= startDate;
    });
  }

  // Filter by end date
  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredData = filteredData.filter((item: any) => {
      const itemDate = new Date(item.createdAt || item.creationDate);
      return itemDate <= endDate;
    });
  }

  // Filter by stock (if applicable)
  if (filters.stock && filters.stock.length > 0) {
    filteredData = filteredData.filter((item: any) =>
      filters.stock.includes(item.name || item.batchNumber)
    );
  }

  // Filter by publish status (if applicable)
  if (filters.publish && filters.publish.length > 0) {
    filteredData = filteredData.filter((item: any) => filters.publish.includes(item.status));
  }

  return filteredData;
}
