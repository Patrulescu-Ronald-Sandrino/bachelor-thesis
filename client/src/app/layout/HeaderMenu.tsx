import { Button, Link, Menu, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/configureStore.ts';
import React, { useState } from 'react';
import { signOut } from '../../features/account/accountSlice.ts';

export default function HeaderMenu() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account).user!;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        color="inherit"
        sx={{ textTransform: 'none', typography: 'h6' }}
      >
        {user.username}
      </Button>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose}>
        <MenuItem component={Link} href="/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={() => dispatch(signOut())}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
