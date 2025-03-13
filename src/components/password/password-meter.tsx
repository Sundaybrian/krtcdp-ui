import React, { useState, useEffect } from 'react';

import { Box, Typography, LinearProgress } from '@mui/material';

const PasswordMeter = ({ userPassword }: { userPassword: string }) => {
  // const [pWord, setPassword] = useState<string>('');
  const [passStrength, setStrength] = useState<number>(0);

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  useEffect(() => {
    // setPassword(userPassword);
    setStrength(calculateStrength(userPassword));
  }, [userPassword]);

  const checkPassStrength = () => {
    if (passStrength < 2) {
      return 'error';
    }
    if (passStrength < 4) {
      return 'warning';
    }
    return 'success';
  };

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        color={checkPassStrength()}
        value={(passStrength / 5) * 100}
      />
      <Typography variant="body2" color="textSecondary">
        Password Strength: {passStrength}/5
      </Typography>
    </Box>
  );
};

export default PasswordMeter;
