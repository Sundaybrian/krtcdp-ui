'use client';

import type { Cooperative } from 'src/types/user';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { getUserById, getCooperativeById, getCooperativeByUnionId } from 'src/api/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id?: any;
    name?: string;
    logo?: string;
    plan?: string;
    groupName?: string;
    county?: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const popover = usePopover();
  const { user } = useAuthContext();

  const { setField, setState, state } = useLocalStorage('tenant', {
    name: '',
    logo: '',
    groupName: '',
    county: '',
    coopId: 0,
  });

  const mediaQuery = 'sm';

  const [workspace, setWorkspace] = useState(data[0]);
  const [cooperative, setCooperative] = useState<Cooperative>();
  const [unionCooperatives, setUnionCooperatives] = useState<Cooperative[]>();

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      setWorkspace(newValue);
      popover.onClose();
    },
    [popover]
  );

  // get  current user cooperatives
  const getAdminCooperative = async () => {
    try {
      const userResponse = await getUserById(user?.id);
      if (userResponse?.coopUnionId) {
        const response = await getCooperativeByUnionId(userResponse?.coopUnionId);

        setUnionCooperatives(response);

        const defaultCoop = response.find((coop) => coop.id === state?.coopId) || response[0];
        setCooperative(defaultCoop);
        setField('name', defaultCoop?.groupName);
        setField('logo', defaultCoop?.groupName);
        setField('groupName', defaultCoop?.groupName);
        setField('county', defaultCoop?.county);
        setField('coopId', defaultCoop?.id);
        setState({
          name: defaultCoop?.groupName,
          logo: defaultCoop?.groupName,
          coopId: defaultCoop?.id,
          county: defaultCoop?.county,
        });
      } else if (userResponse?.coopId) {
        const response = await getCooperativeById(userResponse?.coopId);
        setCooperative(response);
        setField('name', response?.groupName);
        setField('logo', response?.groupName);
        setField('groupName', response?.groupName);
        setField('county', response?.county);
        setField('coopId', response?.id);
        setState({
          name: response?.groupName,
          logo: response?.groupName,
          coopId: response?.id,
          county: response?.county,
        });
      }
    } catch (error) {
      toast.error('Error fetching cooperative');
    }
  };

  const setSelectedCooperative = (coop: Cooperative) => {
    setCooperative(coop);
    setField('name', coop?.groupName);
    setField('logo', coop?.groupName);
    setField('groupName', coop?.groupName);
    setField('county', coop?.county);
    setField('coopId', coop?.id);
    setState({
      name: coop?.groupName,
      logo: coop?.groupName,
      coopId: coop?.id,
      county: coop?.county,
    });

    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
  };

  useEffect(() => {
    if (user?.id) {
      getAdminCooperative();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          ...sx,
        }}
        {...other}
      >
        {/* <Box
          component="img"
          alt={'workspace'}
          src={cooperative?.groupName}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        /> */}

        <Avatar
          alt={cooperative?.groupName || 'Cooperative'}
          src={cooperative?.groupName || 'Cooperative'}
          sx={{ width: 24, height: 24 }}
        />
        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {cooperative?.groupName}
        </Box>

        <Label
          color={workspace?.plan === 'Free' ? 'default' : 'info'}
          sx={{
            height: 22,
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {cooperative?.county}
        </Label>

        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList sx={{ width: 240 }}>
          {data
            .filter((option) => {
              if (user?.userType === 'SYSTEM_ADMIN') {
                return true;
              }
              if (user?.userType === 'COOPERATIVE_ADMIN') {
                return option.id === cooperative?.id;
              }
              if (user?.userType === 'COOPERATIVE_UNION_ADMIN') {
                return unionCooperatives?.find((coop) => coop.id === option.id);
              }
              return false;
            })
            .map((option) => (
              <MenuItem
                key={option.id}
                selected={option.id === workspace?.id}
                onClick={() => {
                  handleChangeWorkspace(option);
                  setSelectedCooperative(option as any);
                }}
                sx={{ height: 48 }}
              >
                <Avatar
                  alt={option.groupName}
                  src={option.groupName}
                  sx={{ width: 24, height: 24 }}
                />

                <Box component="span" sx={{ flexGrow: 1 }}>
                  {option.groupName}
                </Box>
              </MenuItem>
            ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
