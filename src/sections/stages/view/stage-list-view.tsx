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
import { useSearchRoutes } from 'src/actions/route';

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
  assignFarmerToStage,
  createMilkTask,
  searchCoopFarmers,
} from 'src/api/services';
import { CoopFarmerList } from 'src/types/user';

import { TicketViewDialog } from './stage-view-dialog';
import { CooperativeTableToolbar } from '../stage-table-toolbar';
import { CooperativeTableFiltersResult } from '../stage-table-filters-result';
import {
  RenderAgent,
  RenderGeneric,
  RenderCreatedAt,
  RenderCellStatus,
  RenderCellProduct,
  RenderRoute,
} from '../route-table-row';
import { useSearchStages } from 'src/actions/collections';

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
  farmers: zod.array(zod.any()),
});

// ----------------------------------------------------------------------

export function StageListView() {
  const confirmRows = useBoolean();
  const farmerAssign = useBoolean();
  const quickView = useBoolean();

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const perms = getStorage('permissions');

  const router = useRouter();

  const { searchResults, searchLoading } = useSearchStages({ cooperativeId: state.coopId });

  console.log('searchResults stages', searchResults);

  const userSearch = {
    userType: 'MILK_MAN',
    coopId: state.coopId,
  };

  const { userResults } = useSearchAdmins({ ...userSearch });
  const [selectedStage, setSelectedStage] = useState<RouteItem>();
  const [farmers, setFarmers] = useState<CoopFarmerList[]>([]);

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });

  const [tableData, setTableData] = useState<RouteItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (searchResults.length) {
      setTableData(searchResults);
    }

    searchCoopFarmers(state.coopId ? { cooperativeId: state.coopId } : {}).then((data) => {
      if (data.results.length) {
        setFarmers(data.results);
      }
    });
  }, [state.coopId, searchResults]);

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
      const sTicket = tableData.find((row) => row.id === id);
      quickView.onTrue();
    },
    [tableData, quickView]
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
      farmers: [],
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
    const { farmers } = fMethods.getValues();
    if (!farmers || farmers.length === 0) {
      toast.error('Please select a farmer');
      return;
    }
    const selectedRows = tableData.filter((row) => selectedRowIds.includes(row.id!));
    if (selectedRows.length === 0) {
      toast.error('Please select at least one stage');
      return;
    }

    try {
      await assignFarmerToStage(selectedStage!.id, {
        farmerIds: farmers.map((f: any) => Number(f.id)),
      });
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
      field: 'name',
      headerName: 'Name',
      // flex: 1,
      maxWidth: 180,
      width: 150,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },

    {
      field: 'description',
      headerName: 'Description',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'sequence',
      headerName: 'Sequence',
      width: 100,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'routeId',
      headerName: 'Route ID',
      width: 100,
      renderCell: (params) => <RenderRoute params={params} />,
    },
    {
      field: 'latitude',
      headerName: 'Latitude',
      width: 120,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'longitude',
      headerName: 'Longitude',
      width: 120,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'areaBoundaries',
      headerName: 'Area Boundaries',
      width: 180,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'estimatedDistance',
      headerName: 'Est. Distance (km)',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'estimatedDuration',
      headerName: 'Est. Duration (min)',
      width: 140,
      renderCell: (params) => <RenderGeneric params={params} />,
    },

    {
      field: 'farmerCount',
      headerName: 'Farmers',
      width: 110,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'taskCount',
      headerName: 'Tasks',
      width: 110,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'collectionCount',
      headerName: 'Collections',
      width: 110,
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
          icon={<Iconify icon="solar:user-plus-bold" />}
          label="Assign Farmer"
          onClick={() => {
            farmerAssign.onTrue();
            setSelectedRowIds([params.row.id!]);
            setSelectedStage(params.row);
          }}
          sx={{ color: 'info.main' }}
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
          heading="Stages"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Stages', href: paths.dashboard.collections.routes.root },
            { name: 'Listed Stages' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.collections.stages.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New
            </Button>
          }
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

      <ConfirmDialog
        open={farmerAssign.value}
        onClose={farmerAssign.onFalse}
        title="Assign Farmer"
        content={
          <>
            <Stack spacing={2}>
              <p>Select Farmer</p>
              <Form methods={fMethods} onSubmit={methods.handleSubmit(() => {})}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <Field.Autocomplete
                    name="farmers"
                    label="Select farmer"
                    placeholder="+ Farmer"
                    freeSolo
                    disableCloseOnSelect
                    multiple
                    options={farmers.map((user) => user)}
                    getOptionLabel={(option) =>
                      `${option.firstName || ''} ${option.lastName || ''}`
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id || option.id}>
                        {option.firstName}--{option.lastName}--{option.mobilePhone}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.email}
                          label={option.email}
                          size="small"
                          color="info"
                          variant="soft"
                        />
                      ))
                    }
                  />
                </Box>
              </Form>
            </Stack>
          </>
        }
        action={
          <Button
            variant="contained"
            // color="error"
            onClick={() => {
              handleAssignFarmer();
              farmerAssign.onFalse();
            }}
          >
            Assign
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
