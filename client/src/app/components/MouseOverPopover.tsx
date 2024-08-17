import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Popover } from '@mui/material';

interface Props extends PropsWithChildren {
  popoverContent: ReactNode;
}

export default function MouseOverPopover({ children, popoverContent }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function handlePopoverOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handlePopoverClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  return (
    <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      {children}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        // onMouseLeave={handlePopoverClose}
        slotProps={{ paper: { onMouseLeave: handlePopoverClose } }}
      >
        {popoverContent}
      </Popover>
    </div>
  );
}
