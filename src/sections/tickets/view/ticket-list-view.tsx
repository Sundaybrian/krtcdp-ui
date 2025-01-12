'use client';

import type { ITicket } from 'src/types/notification';
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

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { requiredPermissions, TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchTickets } from 'src/actions/notification';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { TicketViewDialog } from './ticket-view-dialog';
import { CooperativeTableToolbar } from '../ticket-table-toolbar';
import { CooperativeTableFiltersResult } from '../ticket-table-filters-result';
import {
  RenderAgent,
  RenderGeneric,
  RenderCreatedAt,
  RenderCellStatus,
  RenderCellProduct,
} from '../ticket-table-row';

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

export function TicketListView() {
  const confirmRows = useBoolean();
  const quickView = useBoolean();

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const perms = getStorage('permissions');

  const router = useRouter();

  const { searchResults, searchLoading } = useSearchTickets({ coopId: state.coopId });
  const [selectedTicket, setSelectedTicket] = useState<ITicket>();

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });

  const [tableData, setTableData] = useState<ITicket[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (searchResults.length) {
      console.log('searchResults', searchResults);

      setTableData(searchResults);
    }
  }, [searchResults, state.coopId]);

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
      setSelectedTicket(sTicket);
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

  //  handle permission
  const { permissions = [], isSuperAdmin = false } = perms;

  if (permissions.includes(requiredPermissions.tickets.viewTicket) === false && !isSuperAdmin) {
    return <PermissionDeniedView permission="viewTicket" />;
  }

  const columns: GridColDef[] = [
    {
      field: 'locationName',
      headerName: 'Location name',
      flex: 1,
      // maxWidth: 8,
      // width: 70,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'agent',
      headerName: 'Assigned To',
      width: 160,
      renderCell: (params) => <RenderAgent params={params} />,
    },
    {
      field: 'issueSummary',
      headerName: 'Summary',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    // {
    //   field: 'location',
    //   headerName: 'Location',
    //   width: 110,
    //   type: 'singleSelect',
    //   editable: true,
    //   renderCell: (params) => <RenderCellLocation params={params} />,
    // },

    {
      field: 'source',
      headerName: 'Source',
      width: 110,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'farmType',
      headerName: 'Farm Type',
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
      field: 'whoPays',
      headerName: 'Who Pays',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'pestorDiseaseName',
      headerName: 'Pest or Disease Name',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'cropAnimalName',
      headerName: 'Crop/Animal Name',
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
          label="View"
          onClick={() => handleViewRow(params.row.id)}
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

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Tickets', href: paths.dashboard.product.root },
            { name: 'Tickets' },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.notification.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Broadcast
          //   </Button>
          // }
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

      <TicketViewDialog
        open={quickView.value}
        onClose={quickView.onFalse}
        ticket={selectedTicket!}
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
  inputData: ITicket[];
  filters: IProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.description));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.status));
  }

  return inputData;
}
