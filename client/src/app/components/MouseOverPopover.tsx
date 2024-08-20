import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Popover, PopoverOrigin } from '@mui/material';

interface Props extends PropsWithChildren {
  popoverContent: ReactNode;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export default function MouseOverPopover({
  children,
  popoverContent,
  anchorOrigin,
  transformOrigin,
}: Props) {
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
        slotProps={{ paper: { onMouseLeave: handlePopoverClose } }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {popoverContent}
      </Popover>
    </div>
  );
}
