import { PropsWithChildren, ReactNode } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props extends PropsWithChildren {
  title: string;
  open: boolean;
  onClose: () => void;
  headerActions?: ReactNode;
}

export default function AppDialog({
  title,
  open,
  onClose,
  headerActions,
  children,
}: Props) {
  const allHeaderActions = (
    <Box display="flex" alignItems="center">
      {headerActions}

      <IconButton onClick={onClose} color="inherit" title="Close">
        <CloseIcon />
      </IconButton>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClick={(event) => event.stopPropagation()}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div style={{ visibility: 'hidden' }}>{allHeaderActions}</div>

        <DialogTitle align="center" sx={{ paddingY: 1.25 }}>
          {title}
        </DialogTitle>

        {allHeaderActions}
      </Box>

      <DialogContent dividers sx={{ paddingTop: 1 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
