import type { IUserAccountBillingHistory } from 'src/types/user';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { ValueChain } from 'src/types/value-chain';

// ----------------------------------------------------------------------

type Props = {
  valueChains: ValueChain[];
};

export function FarmValueChainView({ valueChains }: Props) {
  const showMore = useBoolean();

  return (
    <Card>
      <CardHeader title="Farm value chain" />

      <Stack spacing={1.5} sx={{ px: 3, pt: 3 }}>
        {(showMore.value ? valueChains : valueChains.slice(0, 8)).map((valueChain) => (
          <Stack key={valueChain.id} direction="row" alignItems="center">
            <ListItemText
              primary={`${valueChain.valueChainType} ${valueChain.valueChainName}`}
              secondary={`Harvest date: ${fDate(valueChain.creationDate)}\n Use: ${valueChain.intendedUseOfHarvest}`}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />

            <Typography variant="body2" sx={{ textAlign: 'right', mr: 5 }}>
              Season: {valueChain.season}, Area: {valueChain.areaInAcres} acres
            </Typography>
          </Stack>
        ))}

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>

      <Stack alignItems="flex-start" sx={{ p: 2 }}>
        <Button
          size="small"
          color="inherit"
          startIcon={
            <Iconify
              width={16}
              icon={showMore.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              sx={{ mr: -0.5 }}
            />
          }
          onClick={showMore.onToggle}
        >
          Show {showMore.value ? `less` : `more`}
        </Button>
      </Stack>
    </Card>
  );
}
