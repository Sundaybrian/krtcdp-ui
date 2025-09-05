import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { List, ListItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TableEmptyRows, useTable } from 'src/components/table';

import {
  adjustMilkQuantity,
  approveMilkAggregation,
  approveTicket,
  createBillingPeriod,
  fetchBillingPeriods,
} from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';
import { InvoiceTableRow } from '../invoice-table-row';
import { BillingPeriodTableRow } from '../billing-period-row';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  periodName: zod.string(),
  startDate: zod.any(),
  endDate: zod.any(),
  cooperativeId: zod.number(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  coopId: number;
};

export function BillingPeriodListDialog({ coopId, open, onClose }: Props) {
  const table = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<any[]>([]);
  const [dataFiltered, setDataFiltered] = useState<any[]>([]);

  const notFound = !dataFiltered.length || !dataFiltered.length;

  const TABLE_HEAD = [
    { id: 'periodName', label: 'Period Name', align: 'left' },
    { id: 'startDate', label: 'Start Date', align: 'left' },
    { id: 'endDate', label: 'End Date', align: 'left' },
    { id: '' },
  ];

  const getBillingPeriods = useCallback(async () => {
    try {
      const response = await fetchBillingPeriods({ cooperativeId: Number(coopId) });
      console.log(response);

      setTableData(response.results);
      setDataFiltered(response.results);
    } catch (error) {
      toast.error('Failed to fetch billing periods');
    }
  }, [coopId]);

  useEffect(() => {
    getBillingPeriods();
  }, [getBillingPeriods]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 800 } }}
    >
      <DialogTitle>Billing Periods</DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 500 }}>
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
                    <BillingPeriodTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewRow={() => {
                        console.log(row.id);
                      }}
                      onEditRow={() => {
                        console.log(row.id);
                      }}
                      onDeleteRow={() => {
                        console.log(row.id);
                      }}
                    />
                  ))}

                <TableEmptyRows height={table.dense ? 56 : 56 + 20} emptyRows={0} />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
