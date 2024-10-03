import type { Farm, Expense } from 'src/types/farm';
import type { IPaymentCard } from 'src/types/common';
import type { ValueChain } from 'src/types/value-chain';

import Grid from '@mui/material/Unstable_Grid2';

import { FarmView } from './farm-view';
import { FarmValueChainView } from './farm-value-chain-view';

// ----------------------------------------------------------------------

type Props = {
  farms: Farm[];
  cards: IPaymentCard[];
  expenses: Expense[];
  valueChains: ValueChain[];
  onSelectFarm: (farmId: number) => void;
};

export function Farms({ cards, farms, valueChains, expenses, onSelectFarm }: Props) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <FarmView farms={farms} onSelectFarm={onSelectFarm} cardList={cards} expenses={expenses} />

        {/* <AccountBillingPayment cards={cards} /> */}

        {/* <AccountBillingAddress addressBook={addressBook} /> */}
      </Grid>

      <Grid xs={12} md={4}>
        <FarmValueChainView valueChains={valueChains} />
      </Grid>
    </Grid>
  );
}
