import { Attraction } from '../../../app/models/attraction.ts';
import { useCollectionsContext } from '../../common/useCollectionsContext.tsx';
import { LoadingButton } from '@mui/lab';
import { CheckBox, TurnedIn, TurnedInNot } from '@mui/icons-material';
import MouseOverPopover from '../../../app/components/MouseOverPopover.tsx';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';
import AddToCollectionNewDialog from './AddToCollectionNewDialog.tsx';

const collectionThumbnailWidth = 65;

export default function AddToCollectionIcon({
  attraction,
}: {
  attraction: Attraction;
}) {
  const { collections, setCollections, username } = useCollectionsContext();

  const indicesOfCollectionsContained = new Set(
    [...collections.keys()].filter((i) =>
      collections[i].items.some((ci) => ci.attractionId === attraction.id),
    ),
  );

  const [loading, setLoading] = useState(false);

  const [newCollectionDialogOpen, setNewCollectionDialogOpen] = useState(false);
  const [filterPopoverIsOpen, setFilterPopoverIsOpen] = useState<
    boolean | undefined
  >();

  function handleSetNewCollectionDialogOpen(value: boolean) {
    setNewCollectionDialogOpen(value);
    setFilterPopoverIsOpen(value ? undefined : true);
  }

  function handleToggleIncludeItem(index: number) {
    setLoading(true);
    const collection = collections[index];
    const apiFunction = indicesOfCollectionsContained.has(index)
      ? agent.AttractionsCollections.deleteItem
      : agent.AttractionsCollections.addItem;

    apiFunction(username, collection.id, attraction.id)
      .then((response) => {
        const newCollections = collections.map((c) =>
          c.id === collection.id ? response : { ...c },
        );
        setCollections(newCollections);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  const popoverContent = (
    <>
      <Stack component={Paper}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          paddingY={0.5}
          paddingLeft={1}
        >
          <b>Collections</b>

          <IconButton
            title="Add collection"
            onClick={() => {
              handleSetNewCollectionDialogOpen(true);
            }}
            color="inherit"
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderBottomWidth: 2 }} />

        <List>
          {collections.map((collection, i) => (
            <div key={collection.id}>
              <ListItem sx={{ paddingY: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleIncludeItem(i)}
                  width="100%"
                >
                  <img
                    src={collection.thumbnail}
                    width={collectionThumbnailWidth}
                    height={(collectionThumbnailWidth * 9) / 16}
                    alt=" "
                    style={{ backgroundColor: 'lightgray' }}
                  />

                  <Typography sx={{ flexGrow: 1 }}>
                    {collection.name}
                  </Typography>

                  {indicesOfCollectionsContained.has(i) ? (
                    <CheckBox />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                </Box>
              </ListItem>

              {i < collections.length - 1 && <Divider component="li" />}
            </div>
          ))}
        </List>
      </Stack>

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );

  return (
    <>
      <MouseOverPopover
        popoverContent={popoverContent}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        filterIsOpen={filterPopoverIsOpen}
      >
        <LoadingButton sx={{ color: 'inherit', minWidth: 'auto' }}>
          {indicesOfCollectionsContained.size > 0 ? (
            <TurnedIn />
          ) : (
            <TurnedInNot />
          )}
        </LoadingButton>
      </MouseOverPopover>

      <AddToCollectionNewDialog
        username={username}
        attraction={attraction}
        isOpen={newCollectionDialogOpen}
        close={() => handleSetNewCollectionDialogOpen(false)}
        appendCollection={(collection) =>
          setCollections([...collections, collection])
        }
      />
    </>
  );
}
