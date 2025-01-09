'use client';

import type { Order, IOrderTableFilters } from 'src/types/order';

import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { exportExcel } from 'src/utils/xlsx';
import { removeKeyFromArr } from 'src/utils/helper';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { getUserOrders } from 'src/api/services';
import { DashboardContent } from 'src/layouts/dashboard';

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

import { View401 } from 'src/sections/error/401-view';

import { useAuthContext } from 'src/auth/hooks';

import { OrderTableToolbar } from '../order-table-toolbar';
import { UserOrderTableRow } from '../user-order-table-row';
import { OrderTableFiltersResult } from '../order-table-filters-result';

// ----------------------------------------------------------------------
const ORDER_STATUS_OPTIONS = [
  { value: 'PENDINGCONFIRMATION', label: 'Pending confirmation' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLOSED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'APPROVED', label: 'Approved' },
];

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Order No.', width: 88 },
  { id: 'trackingNumber', label: 'Tracking number' },
  { id: 'taxAmount', label: 'Tax amount' },
  { id: 'totalAmount', label: 'Total amount', width: 140 },
  { id: 'subTotal', label: 'Sub total', width: 140 },
  { id: 'createdAt', label: 'Order Date', width: 140 },
  {
    id: 'notes',
    label: 'Notes',
    width: 120,
    align: 'center',
  },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function MyOrderListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const { authenticated } = useAuthContext();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<Order[]>([]);

  const filters = useSetState<IOrderTableFilters>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

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

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleExport = useCallback(() => {
    console.log('Exporting...');
    const exportData = removeKeyFromArr(dataFiltered, [
      'id',
      'userId',
      'lastModifiedDate',
      'taskId',
      'autoInitiatedById',
      'purchaseOrderId',
      'checkOffTransactionId',
      'deletedAt',
      'deleteAt',
      'purchaseOrder',
      'cooperative',
      'farmer',
      'cooperativeId',
      'farmerId',
      'grnId',
      'grn',
    ]);
    exportExcel(exportData, 'Purchase_Orders');
  }, [dataFiltered]);

  // async functions
  const getPurchaseOrders = async () => {
    try {
      const response = await getUserOrders();
      console.log(response);

      setTableData(response.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPurchaseOrders();
  }, []);

  // check if authenticated else redirect to home
  if (!authenticated) {
    return <View401 />;
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="My Orders"
          links={[
            { name: 'Market place', href: paths.product.root },
            { name: 'Checkout', href: paths.product.checkout },
          ]}
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
                      (tab.value === 'APPROVED' && 'success') ||
                      ((tab.value === 'PENDINGCONFIRMATION' || tab.value === 'PENDING') &&
                        'warning') ||
                      'default'
                    }
                  >
                    {[
                      'APPROVED',
                      'PENDINGCONFIRMATION',
                      'PENDING',
                      'FARMERREJECTED',
                      'REJECTED',
                      'CLOSED',
                    ].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
            onExport={handleExport}
          />

          {canReset && (
            <OrderTableFiltersResult
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

            <Scrollbar sx={{ minHeight: 444 }}>
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
                      <UserOrderTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
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
  dateError: boolean;
  inputData: Order[];
  filters: IOrderTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.orderNumber.indexOf(name.toLowerCase()) !== -1 ||
        order.notes.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.trackingNumber.indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
