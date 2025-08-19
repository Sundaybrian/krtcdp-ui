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

import { useBoolean, UseBooleanReturn } from 'src/hooks/use-boolean';
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
import { Filter, FilterDialog } from './filter-dialog';

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
  const verifyDialog = useBoolean();

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const perms = getStorage('permissions');

  const router = useRouter();

  const filters = useSetState<Filter>({
    startDate: '',
    endDate: '',
    route: 0,
    collector: 0,
    shift: 0,
    status: '',
  });

  const query: any = {};
  if (filters.state.route) {
    query.routeId = filters.state.route;
  }
  if (filters.state.collector) {
    query.collectorId = filters.state.collector;
  }
  if (filters.state.shift) {
    query.shiftId = filters.state.shift;
  }
  if (filters.state.startDate) {
    query.dateFrom = new Date(filters.state.startDate).toISOString();
  }

  if (filters.state.endDate) {
    query.dateTo = new Date(filters.state.endDate).toISOString();
  }

  if (filters.state.status) {
    query.status = filters.state.status;
  }

  const { searchResults, searchLoading } = useSearchMilkAggregation({
    cooperativeId: state.coopId,
    ...query,
  });

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
  }, [searchResults, filters]);

  const canReset = filters.state.endDate == null;

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

  const handleRefresh = () => {
    // refetch data from api
    setTableData((prev) => [...prev]);
  };

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
        data={dataFiltered}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds, dataFiltered]
  );

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
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <RenderCellStatus params={params} />,
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
      field: 'aggregationDate',
      headerName: 'Aggregation Date',
      width: 140,
      renderCell: (params) => <RenderCollectionTime params={params} />,
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
            handleViewRow(params.row.id);
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
          label="Milk distribution"
          onClick={() => {
            router.push(paths.dashboard.collections.allocations(params.row.id));
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
        onClose={() => {
          verifyDialog.onFalse();
          handleRefresh();
        }}
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
  data: any[];
  filters: UseSetStateReturn<Filter>;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
  data,
}: CustomToolbarProps) {
  const filterDialog = useBoolean();

  // handle export
  const handleExport = () => {
    const exportData = removeKeyFromArr(data, [
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
      'routeId',
      'shiftId',
      'collectorId',
      'evidencePhotoUrl',
      'verifiedBy',
      'approvedBy',
      'verifiedById',
    ]);

    const finalExportData = exportData.map((aggCol) => ({
      ...aggCol,
      collector: `${aggCol?.collector?.firstName} ${aggCol?.collector?.lastName}`,
      shift: aggCol?.shift?.name,
      route: aggCol?.route?.name,
      cooperative: aggCol?.cooperative?.groupName,
      collections: aggCol?.collections?.length,
    }));

    exportExcel(finalExportData, 'Collections');
  };

  return (
    <>
      <GridToolbarContainer>
        <GridToolbarQuickFilter />

        {/* <CooperativeTableToolbar filters={filters} /> */}

        {/* Add button for more filter that opens a dialog with  status collector and route */}

        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="solar:filter-bold" />}
          onClick={filterDialog.onTrue}
        >
          More Filters
        </Button>
        <FilterDialog open={filterDialog.value} onClose={filterDialog.onFalse} filters={filters} />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {/* {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )} */}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />

          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="solar:export-bold" />}
            onClick={handleExport}
          >
            Export
          </Button>
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
  filters: any;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  return inputData;
}
