import type { IPaymentCard } from 'src/types/common';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { MapMarkersPopups } from '../_examples/extra/map-view/map-markers-popups';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  list: IPaymentCard[];
  selected: (selectedId: string) => boolean;
  onSelect: (card: IPaymentCard | null) => void;
};

export function MapViewDialog({ open, list, onClose, selected, onSelect }: Props) {
  const [searchCard, setSearchCard] = useState('');

  const dataFiltered = applyFilter({ inputData: list, query: searchCard });

  const notFound = !dataFiltered.length && !!searchCard;

  const handleSearchAddress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCard(event.target.value);
  }, []);

  const handleSelectCard = useCallback(
    (card: IPaymentCard | null) => {
      onSelect(card);
      setSearchCard('');
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Stack spacing={2.5} sx={{ p: 3 }}>
      <MapMarkersPopups
        data={[
          {
            capital: 'Nairobi',
            country_code: '254',
            latlng: [1.2921, 36.8219],
            name: '',
            photoUrl: '',
            timezones: [],
          },
        ]}
      />
    </Stack>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> Map View </Typography>
      </Stack>
      {renderList}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: IPaymentCard[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    return inputData.filter(
      (card) => card.cardNumber.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
