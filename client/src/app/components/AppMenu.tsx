import React, { ReactNode, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';

interface Props {
  button: ReactNode;
  items: ReactNode[];
}

export default function AppMenu({ button, items }: Props) {
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
      <div onClick={handleClick}>{button}</div>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose}>
        {items.map((item, i) => (
          <MenuItem key={i} onClick={handleClose}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
