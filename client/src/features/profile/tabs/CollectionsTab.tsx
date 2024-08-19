import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';
import Loadable from '../../../app/layout/Loadable.tsx';
import { AttractionCollection } from '../../../app/models/attractionCollection.ts';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Link,
  Stack,
} from '@mui/material';
import { useAppSelector } from '../../../app/store/configureStore.ts';
import AddIcon from '@mui/icons-material/Add';
import ReorderIcon from '@mui/icons-material/Reorder';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CollectionItemCard from '../../../app/components/CollectionItemCard.tsx';
import { swap } from '../../../app/util/array.ts';
import { LoadingButton } from '@mui/lab';

interface Props {
  username: string;
}

export function CollectionsTab({ username }: Props) {
  const user = useAppSelector((state) => state.account.user);
  const isSelf = user?.username === username;

  const [collections, setCollections] = useState<AttractionCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const [isReordering, setIsReordering] = useState(false);
  const [oldCollections, setOldCollections] = useState<AttractionCollection[]>(
    [],
  );
  const [loadingUpdateOrder, setLoadingUpdateOrder] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    agent.AttractionsCollections.get(username)
      .then((collections) => {
        setCollections(collections);
        setLoading(false);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }, [username]);

  function setIsReorderingAndLog(value: boolean) {
    console.log(`setIsReordering(${value})`);
    setIsReordering(value);
  }

  function handleUpdateOrder() {
    setIsReorderingAndLog(false);
    setLoadingUpdateOrder(true);
    agent.AttractionsCollections.updateOrder(
      username,
      collections.map((c) => c.id),
    )
      .then(() => {
        toast.success('Collections order updated');
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setLoadingUpdateOrder(false));
  }

  function deleteCollection(index: number) {
    const id = collections[index].id;

    setLoadingDelete(true);
    agent.AttractionsCollections.delete(username, id)
      .then(() => {
        const newCollections = [...collections];
        newCollections.splice(index, 1);

        setCollections(newCollections);
        setOldCollections(newCollections);
        toast.success('Collection deleted');
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoadingDelete(false));
  }

  return (
    <>
      <Stack spacing={2}>
        {isSelf && (
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            {!isReordering ? (
              <>
                <IconButton
                  component={Link}
                  href={`/user/${username}/collections/add`}
                  color="inherit"
                  title="Add collection"
                >
                  <AddIcon fontSize="large" />
                </IconButton>

                {collections.length > 1 && (
                  <LoadingButton
                    loading={loadingUpdateOrder}
                    onClick={() => {
                      setOldCollections([...collections]);
                      setIsReorderingAndLog(true);
                    }}
                    color="inherit"
                    title="Reorder collections"
                  >
                    <ReorderIcon fontSize="large" />
                  </LoadingButton>
                )}
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleUpdateOrder}
                  color="inherit"
                  title="Save collections' order"
                >
                  <CheckIcon fontSize="large" />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setIsReorderingAndLog(false);
                    setCollections(oldCollections);
                  }}
                  color="inherit"
                  title="Cancel collections' order"
                >
                  <CloseIcon fontSize="large" />
                </IconButton>
              </>
            )}
          </Box>
        )}

        <Loadable loading={loading} className="centered" spinner>
          {collections.map((collection, i) => {
            const collectionUrl = `/user/${username}/collections/${collection.id}`;
            return (
              <CollectionItemCard
                key={collection.id}
                isEditable={isReordering}
                position={i + 1}
                onPositionChange={(newPosition) =>
                  setCollections(swap(collections, i, newPosition - 1))
                }
                count={collections.length}
                photo={collection.thumbnail}
                titleName={collection.name}
                titleUrl={collectionUrl}
                body={collection.description}
                actions={[
                  <Box
                    component={Link}
                    href={collectionUrl}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    Edit
                  </Box>,
                  <div onClick={() => deleteCollection(i)}>Delete</div>,
                ]}
              >
                {collection.items.map((item, j) => (
                  <CollectionItemCard
                    key={item.attractionId}
                    isEditable={false}
                    position={j + 1}
                    onPositionChange={() => void 0}
                    count={collection.items.length}
                    photo={item.attractionPhoto}
                    titleName={item.attractionName}
                    titleUrl={`/attractions/${item.attractionId}`}
                    body={item.note ? `Note: ${item.note}` : undefined}
                  />
                ))}
              </CollectionItemCard>
            );
          })}
        </Loadable>
      </Stack>

      <Backdrop open={loadingDelete}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
