'use client';

import type { CoopFarmerList } from 'src/types/user';
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

import { exportExcel } from 'src/utils/xlsx';
import { removeKeyFromArr } from 'src/utils/helper';
import { TENANT_LOCAL_STORAGE, INSURANCE_TYPE_OPTIONS } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';
import { approveCoopFarmer, searchCoopFarmers } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BulkFarmerUploadDialog } from './bulk-upload-farmer';
import { CooperativeTableFiltersResult } from '../cooperative-table-filters-result';
import {
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
  category: false,
  krapin: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function CooperativeFarmerListView() {
  const confirmRows = useBoolean();
  const openBulkUpload = useBoolean();

  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const router = useRouter();

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });

  const [tableData, setTableData] = useState<CoopFarmerList[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    searchCoopFarmers(state.coopId ? { cooperativeId: state.coopId } : {}).then((data) => {
      if (data.results.length) {
        setTableData(data.results);
        console.log(data.results);
      }
    });
  }, [state.coopId]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const handleApproval = useCallback(
    async (id: string) => {
      try {
        const data = tableData.find((row) => row.id === id)!;
        console.log(data, 'Data');

        if (!data.Farmer?.cooperativeId) {
          toast.error('Farmer does not belong to a cooperative!');
          return;
        }
        await approveCoopFarmer(data.Farmer?.cooperativeId!, data.id);

        toast.success('Farmer approved successfully!');
      } catch (error) {
        toast.error('Approval failed!');
      }
    },
    [tableData]
  );

  const handleApprovalLeave = useCallback(
    async (id: string) => {
      try {
        const data = tableData.find((row) => row.id === id)!;
        if (!data.Farmer?.cooperativeId) {
          toast.error('Farmer does not belong to a cooperative!');
          return;
        }
        await approveCoopFarmer(data.Farmer?.cooperativeId!, data.id);

        toast.success('Farmer approved successfully!');
      } catch (error) {
        toast.error('Approval failed!');
      }
    },
    [tableData]
  );

  const rejectFarmerJoin = useCallback(
    async (id: string) => {
      try {
        const data = tableData.find((row) => row.id === id)!;
        if (!data.Farmer?.cooperativeId) {
          toast.error('Farmer does not belong to a cooperative!');
          return;
        }
        await approveCoopFarmer(data.Farmer?.cooperativeId!, data.id);

        toast.success('Farmer approved successfully!');
      } catch (error) {
        toast.error('Approval failed!');
      }
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
      router.push(paths.dashboard.cooperative.details(id));
    },
    [router]
  );

  const handleExport = () => {
    const exportData = removeKeyFromArr(dataFiltered, [
      'id',
      'acceptTerms',
      'lastUpdateDate',
      'createbyId',
      'password',
      'coopUnionId',
      'emailVerified',
      'phoneVerified',
      'accountState',
      'userType',
      'roleId',
      'permissionsId',
      'subCounty',
      'ward',
      'isAdministrator',
      'isSupport',
      'passwordReset',
      'verificationToken',
      'resetToken',
      'resetTokenExpires',
      'lastPasswordResetDate',
      'refreshHashedToken',
      'coopId',
      'accessRights',
      'verified',
      'userState',
      'deletedAt',
      'lastLoginDate',
      'lastModifiedDate',
      'Farmer',
    ]);
    exportExcel(exportData, 'Farmers');
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
        handleExport={handleExport}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds, dataFiltered]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      width: 200,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },

    {
      field: 'mobilePhone',
      headerName: 'Phone Number',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'accountState',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => <RenderGeneric params={params} />,
    },
    {
      field: 'insuranceType',
      headerName: 'Insuarance Type',
      width: 160,
      type: 'singleSelect',
      valueOptions: INSURANCE_TYPE_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: 'maritalStatus',
      headerName: 'Marital Status',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'residence',
      headerName: 'Residence',
      width: 110,
      type: 'singleSelect',
      editable: true,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },

    {
      field: 'county',
      headerName: 'County',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderGeneric params={params} key="county" />,
    },

    {
      field: 'subCounty',
      headerName: 'Sub County',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderGeneric params={params} key="subCounty" />,
    },

    {
      field: 'hasInsurance',
      headerName: 'Insured',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderHasInsurance params={params} />,
    },

    {
      field: 'insuranceProvider',
      headerName: 'Insurance Provider',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderInsuranceProvidere params={params} />,
    },

    {
      field: 'krapin',
      headerName: 'KRA PIN',
      width: 110,
      editable: false,
      hideable: true,
      renderCell: (params) => <RenderGeneric params={params} key="krapin" />,
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
        // <GridActionsCellItem
        //   showInMenu
        //   icon={<Iconify icon="solar:pen-bold" />}
        //   label="Edit"
        //   onClick={() => handleEditRow(params.row.id)}
        // />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:check-square-bold" />}
          label="Approve Join"
          onClick={() => {
            handleApproval(params.row.id);
          }}
          sx={{ color: 'error.success' }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:user-cross-bold" />}
          label="Reject Join"
          onClick={() => {
            rejectFarmerJoin(params.row.id);
          }}
          sx={{ color: 'error.error' }}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:check-circle-bold" />}
          label="Approve Leave"
          onClick={() => {
            handleApprovalLeave(params.row.id);
          }}
          sx={{ color: 'error.info' }}
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
            { name: 'Cooperative', href: paths.dashboard.product.root },
            { name: 'Coop Farmers' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.farner.newCoopFarmer}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Farmer
              </Button>

              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={openBulkUpload.onTrue}
              >
                Bulk Upload
              </Button>
            </Stack>
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

      <BulkFarmerUploadDialog
        actions={[]}
        open={openBulkUpload.value}
        onClose={openBulkUpload.onFalse}
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
  handleExport: () => void;
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
  handleExport,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        {/* <CooperativeTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        /> */}

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

          <Button onClick={handleExport}>
            <Iconify icon="solar:export-bold" />
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
  inputData: CoopFarmerList[];
  filters: IProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.lastName));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.residence));
  }

  return inputData;
}
