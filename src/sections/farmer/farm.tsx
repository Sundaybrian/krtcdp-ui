import Grid from '@mui/material/Unstable_Grid2';

import type { IPaymentCard, IAddressItem } from 'src/types/common';
import { Farm } from 'src/types/farm';
import { ValueChain } from 'src/types/value-chain';

import { FarmValueChainView } from './farm-value-chain-view';
import { FarmView } from './farm-view';

// ----------------------------------------------------------------------

type Props = {
  farms: Farm[];
  cards: IPaymentCard[];
  addressBook: IAddressItem[];
  valueChains: ValueChain[];
  onSelectFarm: (farmId: number) => void;
};

export function Farms({ cards, farms, valueChains, addressBook, onSelectFarm }: Props) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <FarmView
          farms={farms}
          onSelectFarm={onSelectFarm}
          cardList={cards}
          addressBook={addressBook}
        />

        {/* <AccountBillingPayment cards={cards} /> */}

        {/* <AccountBillingAddress addressBook={addressBook} /> */}
      </Grid>

      <Grid xs={12} md={4}>
        <FarmValueChainView valueChains={valueChains} />
      </Grid>
    </Grid>
  );
}
