'use client';

import type { IUserTableFilters } from 'src/types/user';
import type { InsuranceProvider } from 'src/types/transaction';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { getStorage } from 'src/hooks/use-local-storage';

import { exportExcel } from 'src/utils/xlsx';
import { removeKeyFromArr } from 'src/utils/helper';
import { requiredPermissions } from 'src/utils/default';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { getUserTypes, searchInsuranceProviders } from 'src/api/services';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { PermissionDeniedView } from 'src/sections/permission/view';

import { UserTableRow } from '../provider-table-row';
import { UserTableToolbar } from '../provider-table-toolbar';
import { UserTableFiltersResult } from '../provider-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  ...[{ value: 'deleted', label: 'Deleted' }],
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  // { id: 'lastName', label: 'Last Name' },
  { id: 'contactPhone', label: 'Phone number', width: 180 },
  { id: 'contactEmail', label: 'Contanct Email', width: 220 },
  { id: 'website', label: 'Website', width: 180 },
  { id: 'description', label: 'Description', width: 100 },
  { id: 'targetMarket', label: 'Target Marker', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function InsuranceProviderListView() {
  const router = useRouter();

  const perms = getStorage('permissions');

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<InsuranceProvider[]>([]);
  const [dataFiltered, setDataFiltered] = useState<InsuranceProvider[]>([]);
  const [userTypes, setUserTypes] = useState<string[]>([]);

  const filters = useSetState<IUserTableFilters>({ name: '', role: [], status: 'all' });

  const applyNewFilter = (data: InsuranceProvider[]) => {
    const filteredData = applyFilter({
      inputData: data,
      comparator: getComparator(table.order, table.orderBy),
      filters: filters.state,
    });

    setDataFiltered(filteredData);
  };

  const table = useTable({ defaultOrderBy: 'creationDate', defaultOrder: 'desc' });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      console.log('here', newValue);

      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  // export data

  const handleExport = () => {
    const exportData = removeKeyFromArr(dataFiltered, [
      'id',
      'acceptTerms',
      'lastUpdateDate',
      'createbyId',
      'accessRights',
      'verified',
      'userState',
      'deletedAt',
      'lastLoginDate',
      'lastModifiedDate',
    ]);
    exportExcel(exportData, 'Insurance_providers');
  };

  // fetch users
  const fetchInsuranceProviders = () => {
    searchInsuranceProviders()
      .then((data) => {
        setTableData(data.results);
        applyNewFilter(data.results);
      })
      .catch((error) => {
        toast.error('Failed to fetch insurance providers!');
        console.error('Error fetching providers:', error);
      });
  };

  const fetchUserTypes = () => {
    getUserTypes()
      .then((data) => {
        setUserTypes(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch user types');
      });
  };

  // use effect
  useEffect(() => {
    fetchInsuranceProviders();
    fetchUserTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissions = [], isSuperAdmin = false } = perms;

  if (
    permissions.includes(requiredPermissions.insurance.viewInsuranceProvider) === false &&
    !isSuperAdmin
  ) {
    return <PermissionDeniedView />;
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Insurance Provider"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Providers', href: paths.dashboard.insuranceProviders.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.insuranceProviders.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Provider
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'deleted' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'deleted', 'active'].includes(tab.value)
                      ? tableData.filter((user) => user.name === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            onExport={handleExport}
            options={{ roles: userTypes }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
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

type ApplyFilterProps = {
  inputData: InsuranceProvider[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, role } = filters;
  console.log('Role:', role);

  console.log('Input data:', inputData);

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((user) => user.accountState === status);
  // }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.contactPhone));
  }

  return inputData;
}
