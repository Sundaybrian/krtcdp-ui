import type { Harvest } from 'src/types/farm';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Card from '@mui/material/Card';
import { Slider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fDate } from 'src/utils/format-time';

import { approveHarvest, evaluateHarvest } from 'src/api/services';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  harvest: Harvest;
};

export function FarmerHarvest({ harvest }: Props) {
  const [selected, setSelected] = useState<number>();
  // rejected, approved, pending
  const status =
    harvest.status === 'PENDINGCONFIRMATION'
      ? ['approve_harvest']
      : harvest.status === 'REJECTED'
        ? ['reject_harvest']
        : [''];

  const items = [
    { id: 'reject_harvest', label: 'Reject harvest' },
    { id: 'approve_harvest', label: 'Approve harvest' },
    { id: 'evaluate_quantity', label: 'Evaluate quantity' },
  ];
  const methods = useForm({
    defaultValues: { selected: [...status], quantity: 0 },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.selected.includes('approve_harvest')) {
        const approveData = {
          status: 'APPROVED',
        };
        // await approveHarvest(selected!, approveData);
        toast.success('Harvest approved!');
      }

      if (data.selected.includes('reject_harvest')) {
        const rejectData = {
          status: 'REJECTED',
        };
        await approveHarvest(selected!, rejectData);
        toast.success('Harvest rejected!');
      }

      if (data.selected.includes('evaluate_quantity')) {
        const evaluateData = {
          approvedQuantity: harvest.quantity,
        };
        console.log('evaluateData', evaluateData);
        console.log(data);

        await evaluateHarvest(selected!, evaluateData);
        toast.success('Harvest evaluated!');
      }

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  });

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Grid key={harvest.id} container spacing={3}>
          <Grid xs={12} md={4}>
            <Stack key={harvest.id} direction="row" alignItems="center">
              <ListItemText
                primary={`Crop: ${harvest.crop}`}
                secondary={`Harvest Date: ${fDate(harvest.harvestDate)}`}
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{
                  mt: 0.5,
                  component: 'span',
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />

              <Typography variant="body2" sx={{ textAlign: 'right', mr: 5 }}>
                Quantity(KG): {harvest.quantity}
              </Typography>

              <Typography variant="body2" sx={{ textAlign: 'right', mr: 5 }}>
                Status:{' '}
                <Label
                  color={
                    harvest.status === 'PENDING'
                      ? 'default'
                      : harvest.status === 'PENDINGCONFIRMATION'
                        ? 'success'
                        : harvest.status === 'REJECTED'
                          ? 'error'
                          : 'default'
                  }
                >
                  {harvest.status}
                </Label>
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={8}>
            <Stack spacing={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}>
              <Controller
                name="selected"
                control={control}
                render={({ field }) => (
                  <>
                    {items.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        label={item.label}
                        onClick={() => setSelected(harvest.id)}
                        labelPlacement="start"
                        control={
                          <Switch
                            checked={field.value.includes(item.id)}
                            onChange={() => field.onChange(getSelected(values.selected, item.id))}
                          />
                        }
                        sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                      />
                    ))}
                  </>
                )}
              />
              {values.selected.includes('evaluate_quantity') && (
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      key="quantity"
                      label=""
                      labelPlacement="start"
                      control={
                        <Slider
                          defaultValue={harvest.quantity}
                          aria-label="Default"
                          valueLabelDisplay="auto"
                          step={20}
                          marks
                          min={0}
                          max={harvest.quantity}
                        />
                      }
                      sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>
        </Grid>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save changes
        </LoadingButton>
      </Card>
    </Form>
  );
}
