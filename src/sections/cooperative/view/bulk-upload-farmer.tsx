import type { Action } from 'src/api/data.inteface';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { useSearchCooperative } from 'src/actions/cooperative';
import { bulkUploadFarmers, downloadFarmerTemplate } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  coopId: zod.number(),
  file: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  actions: Action[];
};

export function BulkFarmerUploadDialog({
  open,
  actions,
  onClose,
  title = `Bulk upload farmers`,
}: Props) {
  const [searchAddress, setSearchAddress] = useState('');
  const [openForm, setOpenForm] = useState(false);
  // get action id from rolePermissions
  // add checked property to actions

  const [permACtions, setActions] = useState(actions);

  const dataFiltered = applyFilter({ inputData: permACtions, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });
  const { searchResults } = useSearchCooperative();

  const defaultValues = useMemo(
    () => ({
      coopId: 0,
      file: '',
    }),
    []
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // upload data as file
      const formData = new FormData();
      formData.append('file', data.file);

      await bulkUploadFarmers(state.coopId || Number(data.coopId), formData);

      // await bulkUploadFarmers(1, data);
      reset();
      toast.success('Farmers uploaded successfully');
      // router.push(paths.dashboard.user.list);
    } catch (error) {
      console.log('error', error);

      toast.error(error.message || 'Something went wrong. Please try again!');
    }
  });

  // download farmer template
  const handleDownloadTemplate = async () => {
    try {
      downloadFarmerTemplate()
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          // name should have cuurent date-time format
          const fileName: string = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .split('.')[0];
          link.setAttribute('download', `${fileName}_farmer_template.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log('error', error);
        });
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again!');
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6">{title}</Typography>
        <Box>
          <Button sx={{ mr: 1 }} variant="outlined" size="small" color="error" onClick={onClose}>
            Exit
          </Button>
        </Box>
      </Stack>
      {!openForm && (
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              size="medium"
              color="success"
              type="button"
              variant="outlined"
              disabled={isSubmitting}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
          </Stack>

          {/* {upload} */}

          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              // gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              {!state.coopId && (
                <Field.Select name="coopId" label="Select Cooperative">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {searchResults.map((coop, id) => (
                    <MenuItem key={coop.groupName + coop.id} value={coop.id} onClick={() => {}}>
                      {`${coop.groupName} -- ${coop.county}`}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}
              <Field.Upload placeholder="File" name="file" />
            </Box>
          </Card>

          {/* submit button */}
          <Stack sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Stack>
        </Form>
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: Action[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    return inputData.filter(
      (address) => address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
