import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { County } from 'src/api/data.inteface';
import { useGetRouteTasks } from 'src/actions/route';
import { fDateTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  code: zod.any(),
  capital: zod.string().min(1, { message: 'City is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  county?: County;
};

export function TaskViewDialog({ county, open, onClose }: Props) {
  const { tasks, tasksLoading } = useGetRouteTasks(county?.id || '');

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 1000 } }}
    >
      <>
        <DialogTitle>Tasks for {county?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead">
                <Box component="tr">
                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Title
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Status
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Quantity
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Density Reading
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Added water(%)
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Due Date
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Milk temp
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      borderBottom: 1,
                      py: 1,
                      px: 1,
                      textAlign: 'left',
                      color: 'text.secondary',
                    }}
                  >
                    Org. Test
                  </Box>
                </Box>
              </Box>

              {tasksLoading && (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Alert severity="info">Loading tasks...</Alert>
                </Box>
              )}
              <Box component="tbody">
                {tasks.map((task) => (
                  <Box component="tr" key={task.id}>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      <p>{task?.farmer?.firstName + task?.farmer?.lastName || 'Not recorded'}</p>

                      <Label>{task?.farmer?.mobilePhone || ''}</Label>
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.status || 'Not recorded'}
                    </Box>

                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.quantity || 'Not recorded'}
                    </Box>

                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.densityReading || 'Not recorded'}
                    </Box>

                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.addedWaterPercentage || 'Not recorded'}
                    </Box>

                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.dueDate ? fDateTime(task.dueDate) : 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.milkTemperature ?? 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {typeof task.organolepticTest || 'Not recorded'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </>
    </Dialog>
  );
}
