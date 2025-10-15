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
import { PageData } from 'src/sections/collection-report/view';

import { BulkFarmerUploadDialog } from './bulk-upload-farmer';
import { CooperativeTableFiltersResult } from '../cooperative-table-filters-result';
import {
  RenderCoop,
  RenderGeneric,
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderHasInsurance,
  RenderCellCreatedAt,
  RenderInsuranceProvidere,
  RenderFarmer,
} from '../coop-farmer-table-row';
import { CoopFarmerFilterDialog } from './coop-farmer-filter';
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

  const filters = useSetState<any>({
    status: '',
    name: '',
    firstName: '',
    lastName: '',
  });

  const [tableData, setTableData] = useState<CoopFarmerList[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [pageData, setPageData] = useState<PageData>({
    limit: 20,
    page: 1,
    total: 0,
  });

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  // Build query object with all filter parameters for API
  const query: any = useMemo(() => {
    const queryObj: any = {};

    if (filters.state.name) {
      queryObj.name = filters.state.name;
    }

    if (filters.state.firstName) {
      queryObj.firstName = filters.state.firstName;
    }

    if (filters.state.lastName) {
      queryObj.lastName = filters.state.lastName;
    }

    if (filters.state.status) {
      queryObj.status = filters.state.status;
    }
    if (filters.state.memberNumber) {
      queryObj.memberNumber = filters.state.memberNumber;
    }

    return queryObj;
  }, [
    filters.state.name,
    filters.state.firstName,
    filters.state.lastName,
    filters.state.status,
    filters.state.memberNumber,
  ]);

  useEffect(() => {
    searchCoopFarmers(
      state.coopId
        ? { cooperativeId: state.coopId, page: pageData.page, limit: pageData.limit, ...query }
        : {
            page: pageData.page,
            limit: pageData.limit,
            ...query,
          }
    ).then((data) => {
      if (data.results.length) {
        console.log(data.results);

        setTableData(data.results);
      }

      setPageData({
        limit: pageData.limit,
        page: pageData.page,
        total: data.totalItems,
      });
    });
  }, [query, state.coopId, pageData.limit, pageData.page]);

  const canReset =
    filters.state?.status?.length > 0 ||
    filters.state?.name?.length > 0 ||
    filters.state?.firstName ||
    filters.state?.memberNumber;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const handleApproval = useCallback(
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
      router.push(paths.dashboard.farmer.edit(id));
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
    const exportData = removeKeyFromArr(
      dataFiltered.map((famer) => ({
        ...famer,
        cooperative: famer.cooperative?.groupName,
        bankName: famer.Farmer?.bankName,
        branch: famer.Farmer?.branch,
        accountNumber: famer.Farmer?.accountNumber,
        memberNumber: famer.Farmer?.memberNumber,
      })),
      [
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
        'cooperative',
      ]
    );
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
      field: 'coperative',
      headerName: 'Cooperative',
      width: 160,
      renderCell: (params) => <RenderCoop params={params} />,
    },
    {
      field: 'memberNumber',
      headerName: 'Member No',
      width: 160,
      renderCell: (params) => <RenderFarmer params={params} />,
    },
    {
      field: 'bankName',
      headerName: 'Banke Name',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderFarmer params={params} />,
    },

    {
      field: 'branch',
      headerName: 'Branch',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderFarmer params={params} />,
    },

    {
      field: 'accountNumber',
      headerName: 'Account Number',
      width: 110,
      editable: false,
      renderCell: (params) => <RenderFarmer params={params} />,
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
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
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
                href={paths.dashboard.farmer.newCoopFarmer}
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
            // height: { xs: 800, md: 2 },
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
            pageSizeOptions={[10, 20, 40, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
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
              setPageData((prev) => ({
                ...prev,
                page: newModel.page + 1,
                limit: newModel.pageSize,
              }));
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
  const filterDialog = useBoolean();

  return (
    <>
      <GridToolbarContainer>
        {/* <GridToolbarQuickFilter /> */}

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

          <Button onClick={handleExport}>
            <Iconify icon="solar:export-bold" />
            Export
          </Button>
        </Stack>

        <CoopFarmerFilterDialog
          open={filterDialog.value}
          onClose={filterDialog.onFalse}
          filters={filters}
        />
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
  return inputData;
}
