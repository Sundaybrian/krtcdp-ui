import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
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

import { approveTicket } from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  // status: zod.string().min(1, { message: 'Please select a status' }),
  agentId: zod.number().min(1, { message: 'Please select an agent' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  ticket: ITicket;
};

export function TicketViewDialog({ ticket, open, onClose }: Props) {
  const { userResults } = useSearchAdmins({ coopId: ticket?.coopId });
  const defaultValues = useMemo(
    () => ({
      // status: ticket?.status || '',
      agentId: ticket?.agentId,
    }),
    [ticket?.agentId]
  );

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleReject = async () => {
    const promise = approveTicket(ticket?.id, {
      agentId: ticket?.agentId,
      approved: false,
      rejectionReason: 'Admin rejected ticket',
    });
    try {
      reset();
      // onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Ticked status updated',
        error: 'Update failed!',
      });

      await promise;
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const promise = approveTicket(ticket?.id, {
      agentId: data.agentId,
      approved: true,
    });
    try {
      reset();
      // onClose();
      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Ticked status updated',
        error: 'Update failed!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>View Ticket</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity={ticket?.agentId ? 'error' : 'info'} sx={{ mb: 3 }}>
            {ticket?.agentId
              ? `This ticked has already been asigned to agent ${
                  ticket.agentId ? `${ticket?.agent?.lastName} ${ticket?.agent?.firstName}` : ''
                }`
              : 'You can assign this ticket to an agent'}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Card>
              <Stack sx={{ p: 2 }} spacing={1.5}>
                <Typography variant="subtitle2">Images</Typography>
                <Stack direction="row" spacing={1}>
                  {ticket?.imageUrls.map((imageUrl, id) => (
                    <Box
                      key={imageUrl + id}
                      component="img"
                      src={imageUrl}
                      sx={{ width: 200, height: 150 }}
                    />
                  ))}
                </Stack>
              </Stack>
              <CardHeader title="Infomartion" subheader="Ticket informmation" sx={{ mb: 3 }} />

              {/* <Field.Text disabled name="source" label="Source" />
              <Field.Text disabled rows={3} name="issueSummary" label="Issue Summary" />
              <Field.Text disabled rows={4} name="description" label="Description" /> */}

              {/* list */}
              <List>
                <ListItem>
                  <Label color="default">Source:</Label> {ticket?.source}
                </ListItem>
                <ListItem>
                  <Label>Summary:</Label>
                  {ticket?.issueSummary}
                </ListItem>
                <ListItem>
                  <Label>Description:</Label>
                  {ticket?.description}
                </ListItem>

                <ListItem>
                  <Label
                    color={
                      ticket?.approvalState === 'APPROVED_BY_COOP' ||
                      ticket?.approvalState === 'ACTIVE'
                        ? 'success'
                        : ticket?.approvalState === 'REJECTED_BY_COOP'
                          ? 'error'
                          : 'info'
                    }
                  >
                    Status: {ticket?.status}
                  </Label>
                </ListItem>
              </List>

              <Divider />
            </Card>

            <Card>
              <CardHeader title="Agent" subheader="Assign to agent" sx={{ mb: 3 }} />

              <Divider />

              <Stack spacing={3} sx={{ p: 3 }}>
                {/* <Field.Select name="status" label="Status">
                  <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {TICKET_STATUS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select> */}

                {/* {agent} */}

                <Field.Select name="agentId" label="Select agent">
                  <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {userResults.map((user) => (
                    <MenuItem key={user.id + user.email} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          {ticket?.approvalState !== 'COMPLETED' &&
            ticket?.approvalState !== 'APPROVED_BY_COOP' && (
              <Button color="error" type="button" variant="outlined" onClick={handleReject}>
                Reject
              </Button>
            )}

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Assign and approve
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
