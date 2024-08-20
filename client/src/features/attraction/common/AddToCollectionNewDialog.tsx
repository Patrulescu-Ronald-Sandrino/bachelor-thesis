import { Attraction } from '../../../app/models/attraction.ts';
import { AttractionCollection } from '../../../app/models/attractionCollection.ts';
import { useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';
import AppDialog from '../../../app/components/AppDialog.tsx';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from '@mui/material';

interface Props {
  username: string;
  attraction: Attraction;
  isOpen: boolean;
  close: () => void;
  appendCollection: (collection: AttractionCollection) => void;
}

export default function AddToCollectionNewDialog({
  username,
  attraction,
  isOpen,
  close,
  appendCollection,
}: Props) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attractionNote, setAttractionNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const canAddNewCollection = [name, description].every((x) => x !== '');
  const saveButtonStyle = !canAddNewCollection
    ? { color: 'gray', cursor: 'default' }
    : {};

  function handleAddNewCollection() {
    if (!canAddNewCollection) return;

    setLoading(true);
    agent.AttractionsCollections.add(username, {
      name: name,
      description: description,
      visibility: 'Public',
      items: [{ attractionId: attraction.id, note: attractionNote }],
    } as AttractionCollection)
      .then((response) => {
        appendCollection(response);
        close();
        setName('');
        setDescription('');
        setAttractionNote('');
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  return (
    <AppDialog title="New collection" open={isOpen} onClose={close}>
      <Stack spacing={2}>
        <Box className="centered-flex" paddingY={2} paddingX={20}>
          <img src={attraction.photos[0]} alt="" width={200} />
        </Box>

        <TextField
          label="Collection name"
          required={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <TextField
          label="Collection description"
          multiline
          rows={3}
          required={true}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Note for attraction"
          value={attractionNote}
          onChange={(e) => setAttractionNote(e.target.value)}
        />

        <Divider />

        <Box
          component={Button}
          className="centered-flex"
          style={saveButtonStyle}
          onClick={handleAddNewCollection}
        >
          Save
        </Box>
      </Stack>

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </AppDialog>
  );
}
