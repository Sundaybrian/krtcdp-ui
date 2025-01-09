import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

export type Prop = {
  category: 'CROPS' | 'LIVESTOCK' | 'DAIRY' | 'FARM_INPUTS' | 'MACHINERY' | 'OTHER';
  limit?: number;
};

export const CategoryView = forwardRef<HTMLDivElement, BoxProps & Prop>(
  ({ category, limit = 4, sx, ...other }, ref) => {
    const categoryKeys: any = {
      CROPS: 'red',
      LIVESTOCK: 'green',
      DAIRY: 'blue',
      FARM_INPUTS: 'yellow',
      MACHINERY: 'purple',
      OTHER: 'orange',
    };
    const colorsRange = ['red', 'green', 'blue', 'orange', 'purple'].filter(
      (color) => color === categoryKeys[category]
    );

    console.log('colorsRange', colorsRange);

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          ...sx,
        }}
        {...other}
      >
        {colorsRange.map((color, index) => (
          <Box
            key={color + index}
            sx={{
              ml: -0.75,
              width: 16,
              height: 16,
              bgcolor: color,
              borderRadius: '50%',
              border: (theme) => `solid 2px ${theme.vars.palette.background.paper}`,
              boxShadow: (theme) =>
                `inset -1px 1px 2px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
            }}
          />
        ))}

        {/* {category && limit && (
          <Box component="span" sx={{ typography: 'subtitle2' }}>{`+${restColors}`}</Box>
        )} */}
      </Box>
    );
  }
);
