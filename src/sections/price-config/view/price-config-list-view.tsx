'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
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
import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';
import type { IPriceConfig, IPriceConfigTableFilters } from 'src/types/price-config';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { exportExcel } from 'src/utils/xlsx';
import { removeKeyFromArr } from 'src/utils/helper';
import { requiredPermissions, TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { searchPriceConfig } from 'src/api/services';

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

import { PriceConfigTableRow } from '../price-config-table-row';
import { PriceConfigTableToolbar } from '../price-config-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productName', label: 'Product Name' },
  { id: 'price', label: 'Price' },
  { id: 'effectiveDate', label: 'Effective Date' },
  { id: 'cooperativeId', label: 'Cooperative ID' },
  { id: '', width: 88 },
];

const defaultFilters: IPriceConfigTableFilters = {
  name: '',
  productName: [],
  cooperativeId: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function PriceConfigListView() {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IPriceConfig[]>([]);

  const filters = useSetState(defaultFilters);

  const dataFiltered = useMemo(
    () => applyFilter({ inputData: tableData, filters: filters.state }),
    [tableData, filters.state]
  );

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.productName.length > 0 ||
    filters.state.cooperativeId.length > 0 ||
    !!filters.state.startDate ||
    !!filters.state.endDate;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== Number(id));
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id!.toString()));
    toast.success('Delete success!');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.priceConfig.edit(id));
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
    ]);
    exportExcel(exportData, 'PriceConfigs');
  }, [dataFiltered]);

  useEffect(() => {
    searchPriceConfig({}).then((data) => {
      setTableData(data.results);
    });
  }, [state.coopId]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Price Configuration"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Price Config', href: paths.dashboard.priceConfig.root },
            { name: 'List' },
          ]}
          action={
            <>
              {' '}
              {dataFiltered.length === 0 && (
                <Button
                  component={RouterLink}
                  href={paths.dashboard.priceConfig.new}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  New Price Config
                </Button>
              )}
            </>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <PriceConfigTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              products: ['Milk Grade A', 'Milk Grade B', 'Cream', 'Butter'],
              cooperatives: [
                { id: 1, name: 'Cooperative A' },
                { id: 2, name: 'Cooperative B' },
              ],
            }}
          />

          {canReset && (
            <Box sx={{ p: 2.5, pt: 0 }}>
              <Button
                color="error"
                sx={{ fontSize: 11 }}
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={filters.onReset}
              >
                Clear {filters.state.productName.length + filters.state.cooperativeId.length}{' '}
                filters
              </Button>
            </Box>
          )}

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
                    dataFiltered.map((row) => row.id!.toString())
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
                    <PriceConfigTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id!.toString())}
                      onSelectRow={() => table.onSelectRow(row.id!.toString())}
                      onDeleteRow={() => handleDeleteRow(row.id!.toString())}
                      onEditRow={() => handleEditRow(row.id!.toString())}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 76}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>

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
  inputData: IPriceConfig[];
  filters: IPriceConfigTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { name, productName, cooperativeId, startDate, endDate } = filters;

  let filteredData = inputData;

  if (name) {
    filteredData = filteredData.filter(
      (priceConfig) => priceConfig.productName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (productName.length) {
    filteredData = filteredData.filter((priceConfig) =>
      productName.includes(priceConfig.productName)
    );
  }

  if (cooperativeId.length) {
    filteredData = filteredData.filter((priceConfig) =>
      cooperativeId.includes(priceConfig.cooperativeId)
    );
  }

  if (startDate && endDate) {
    filteredData = filteredData.filter((priceConfig) => {
      const effectiveDate = new Date(priceConfig.effectiveDate);
      return effectiveDate >= startDate && effectiveDate <= endDate;
    });
  }

  return filteredData;
}
