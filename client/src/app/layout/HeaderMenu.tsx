import {
  Avatar,
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/configureStore.ts';
import React, { useState } from 'react';
import { signOut } from '../../features/account/accountSlice.ts';
import NotFound from '../errors/NotFound.tsx';

export default function HeaderMenu() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account).user;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  if (!user) return <NotFound />;

  return (
    <div>
      <Button
        onClick={handleClick}
        color="inherit"
        sx={{ textTransform: 'none', typography: 'h6' }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          {user.image && <Avatar src={user.image} />}
          <Typography variant="h6">{user?.username}</Typography>
        </Box>
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
