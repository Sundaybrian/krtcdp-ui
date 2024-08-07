import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { SubCounty } from 'src/api/data.inteface';
import { Divider, List, ListItem } from '@mui/material';
import { County } from 'src/types/county';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------
type Props = {
  open: boolean;
  onClose: () => void;
  subCounties: SubCounty[];
  county?: County;
};

export function SubcountyList({ subCounties, open, county, onClose }: Props) {
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Sub counties</DialogTitle>

      <DialogContent>
        <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
          List of sub counties for <Label color="primary"> {county?.name}</Label>
        </Alert>

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        >
          {/* table to list subcounties name and code */}
          <List>
            {subCounties.map((subCounty: any) => (
              <ListItem key={subCounty.id}>
                <Label color="default" sx={{ fontSize: '16px' }}>
                  {' '}
                  {subCounty.name}
                </Label>
                <Divider />
              </ListItem>
            ))}
          </List>
        </Box>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
