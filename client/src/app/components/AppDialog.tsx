import { PropsWithChildren } from 'react';
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
}

export default function AppDialog({ title, open, onClose, children }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClick={(event) => event.stopPropagation()}
    >
      <Box display="flex" justifyContent="space-between">
        <Box flexGrow={0.5} />

        <DialogTitle align="center">{title}</DialogTitle>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ paddingTop: 0 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
