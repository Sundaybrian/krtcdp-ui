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
                    Priority
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
                    Cow health
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
                    Treatment
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
                      {task.title || 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.status || 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.priority || 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.dueDate ? fDateTime(task.dueDate) : 'Not recorded'}
                    </Box>

                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.quantity || 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.cowHealth || 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.milkTemperature ?? 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {typeof task.organolepticTest === 'boolean'
                        ? task.organolepticTest
                          ? 'Yes'
                          : 'No'
                        : 'Not recorded'}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1 }}>
                      {task.treatmentType || 'Not recorded'}
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
