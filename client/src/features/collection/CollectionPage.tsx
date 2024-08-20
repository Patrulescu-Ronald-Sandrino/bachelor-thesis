import { useParams } from 'react-router-dom';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import {
  AttractionCollection,
  Item,
  Visibilities,
  Visibility,
} from '../../app/models/attractionCollection.ts';
import agent from '../../app/api/agent.ts';
import Loadable from '../../app/layout/Loadable.tsx';
import NotFound from '../../app/errors/NotFound.tsx';
import { Control, useForm } from 'react-hook-form';
import FormTextInput from '../../app/components/form/FormTextInput.tsx';
import FormSelectList from '../../app/components/form/FormSelectList.tsx';
import { toast } from 'react-toastify';
import { router } from '../../app/router/Routes.tsx';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from '../../app/store/configureStore.ts';
import ReorderIcon from '@mui/icons-material/Reorder';
import CollectionItemCard from '../../app/components/CollectionItemCard.tsx';
import { swap } from '../../app/util/array.ts';
import AppDialog from '../../app/components/AppDialog.tsx';

const validationSchema: yup.ObjectSchema<AttractionCollection> = yup
  .object()
  .shape({
    name: yup.string().required('Name is required'),
    visibility: yup.string<Visibility>().required('Visibility is required'),
    description: yup.string().required('Description is required'),
    id: yup.string().notRequired() as yup.StringSchema<string, yup.AnyObject>,
    thumbnail: yup.string().notRequired() as yup.StringSchema<
      string,
      yup.AnyObject
    >,
    items: yup.array().notRequired() as yup.ArraySchema<Item[], yup.AnyObject>,
  });

export default function CollectionPage() {
  const { username, id } = useParams<{ username: string; id: string }>();
  const isNew = id === undefined;

  const user = useAppSelector((state) => state.account.user);
  const isSelf = user?.username === username;

  const [isEdit, setIsEdit] = useState(false);
  const [collection, setCollection] = useState<AttractionCollection | null>(
    null,
  );

  const [loadingGet, setLoadingGet] = useState(!isNew);
  const isNewOrEdit = isNew || isEdit;

  const { control, reset, handleSubmit } = useForm<AttractionCollection>({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);

  const [isReordering, setIsReordering] = useState(false);
  const [loadingUpdateOrder, setLoadingUpdateOrder] = useState(false);
  const [oldCollectionItems, setOldCollectionItems] = useState<Item[]>([]);

  const [itemNoteDialogAttractionId, setItemNoteDialogAttractionId] = useState<
    string | null
  >(null);
  const [note, setNote] = useState<string | null>(null);
  const [loadingUpdateItemNote, setLoadingUpdateItemNote] = useState(false);

  useEffect(() => {
    if (!isNew) {
      agent.AttractionsCollections.get(username!, id)
        .then((collection) => {
          setCollection(collection);
          reset(collection);
        })
        .finally(() => setLoadingGet(false));
    }
  }, [isNew, username, id, reset]);

  if (loadingGet) return <Loadable loading={loadingGet} target="collection" />;
  if (!isNew && !collection && !loadingGet) return <NotFound />;

  function handleAddCollection(data: AttractionCollection) {
    setLoading(true);
    agent.AttractionsCollections.add(username!, data)
      .then((response) => {
        router
          .navigate(`/user/${username}/collections/${response.id}`)
          .then(() => setLoadingGet(true));
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  function handleUpdateCollection(data: AttractionCollection) {
    setLoading(true);
    agent.AttractionsCollections.update(username!, data)
      .then((response) => {
        setCollection(response);
        reset(response);
        setIsEdit(false);
        toast.success('Collection updated');
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  function handleDeleteCollection() {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    setLoading(true);
    agent.AttractionsCollections.delete(username!, id!)
      .then(() => {
        toast.success('Collection deleted');
        void router.navigate(`/user/${username}?tab=collections`);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  function setIsReorderingAndLog(value: boolean) {
    console.log(`setIsReordering(${value})`);
    setIsReordering(value);
  }

  function handleUpdateCollectionThumbnail(attractionPhoto: string) {
    setLoading(true);
    agent.AttractionsCollections.updateCollectionThumbnail(
      username!,
      id!,
      attractionPhoto,
    )
      .then((response) => {
        setCollection(response);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  function handleUpdateItemNote(attractionId: string, note: string | null) {
    setLoadingUpdateItemNote(true);
    agent.AttractionsCollections.updateItemNote(
      username!,
      id!,
      attractionId,
      note,
    )
      .then((response) => {
        setItemNoteDialogAttractionId(null);
        setCollection(response);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoadingUpdateItemNote(false));
  }

  function handleUpdateItemsOrder() {
    setIsReorderingAndLog(false);
    setLoadingUpdateOrder(true);
    agent.AttractionsCollections.updateItemsOrder(
      username!,
      id!,
      collection!.items.map((x) => x.attractionId),
    )
      .then(() => toast.success('Attractions order updated'))
      .catch((error) => toast.error(error))
      .finally(() => setLoadingUpdateOrder(false));
  }

  function handleDeleteItem(attractionId: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    agent.AttractionsCollections.deleteItem(username!, id!, attractionId)
      .then((response) => {
        setCollection(response);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack spacing={1} component={Paper} sx={{ m: 2, p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              {isNew
                ? 'Add collection'
                : isEdit
                  ? 'Edit collection'
                  : 'View collection'}
            </Typography>

            <div>
              {!isEdit && (
                <IconButton
                  color="inherit"
                  title="View all collections"
                  component={Link}
                  href={`/user/${username}?tab=collections`}
                >
                  <ListIcon />
                </IconButton>
              )}

              {isNewOrEdit ? (
                <>
                  <LoadingButton
                    title="Save"
                    onClick={() =>
                      handleSubmit(
                        isNew ? handleAddCollection : handleUpdateCollection,
                      )()
                    }
                  >
                    <CheckIcon color="success" />
                  </LoadingButton>

                  <IconButton
                    title={isNew ? 'Discard changes' : 'Cancel edit'}
                    onClick={() => {
                      reset(collection!);
                      setIsEdit(false);
                    }}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </>
              ) : (
                isSelf && (
                  <>
                    <IconButton
                      color="inherit"
                      title="Add collection"
                      component={Link}
                      href={`/user/${username}/collections/add`}
                    >
                      <AddIcon />
                    </IconButton>

                    <IconButton
                      color="inherit"
                      title="Edit collection"
                      onClick={() => setIsEdit(true)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="inherit"
                      title="Delete collection"
                      onClick={handleDeleteCollection}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              )}
            </div>
          </Box>

          <Stack direction="row" spacing={2}>
            {collection && collection.thumbnail && (
              <img
                src={collection.thumbnail}
                height={256}
                alt="Collection's thumbnail"
              />
            )}

            {isNewOrEdit ? (
              <form style={{ width: '100%' }}>
                <Stack spacing={1}>
                  <FormTextInput
                    control={control as unknown as Control}
                    label="Name"
                    name="name"
                    fullWidth
                  />

                  <FormSelectList
                    control={control as unknown as Control}
                    label="Visibility"
                    name="visibility"
                    items={Visibilities.map((visibility) => ({
                      label: visibility,
                      value: visibility,
                    }))}
                  />

                  <FormTextInput
                    multiline={true}
                    rows={4}
                    control={control as unknown as Control}
                    name="description"
                    label="Description"
                    fullWidth
                  />
                </Stack>
              </form>
            ) : (
              <Stack spacing={1}>
                <Box>
                  <strong>Name:</strong> {collection!.name}
                </Box>

                <Box>
                  <strong>Visibility:</strong> {collection!.visibility}
                </Box>

                <Box sx={{ whiteSpace: 'pre-wrap' }}>
                  <strong>Description:</strong> {collection!.description}
                </Box>
              </Stack>
            )}
          </Stack>
        </Stack>

        {!isNewOrEdit && (
          <Paper sx={{ m: 2, p: 2 }}>
            {isSelf && (
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                {!isReordering ? (
                  <>
                    {collection!.items.length > 1 && (
                      <LoadingButton
                        loading={loadingUpdateOrder}
                        onClick={() => {
                          setOldCollectionItems([...collection!.items]);
                          setIsReorderingAndLog(true);
                        }}
                        color="inherit"
                        title="Reorder attractions"
                      >
                        <ReorderIcon fontSize="large" />
                      </LoadingButton>
                    )}
                  </>
                ) : (
                  <>
                    <IconButton
                      onClick={handleUpdateItemsOrder}
                      color="inherit"
                      title="Save attractions' order"
                    >
                      <CheckIcon fontSize="large" />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        setIsReorderingAndLog(false);
                        setCollection({
                          ...collection!,
                          items: oldCollectionItems,
                        });
                      }}
                      color="inherit"
                      title="Cancel attractions' order"
                    >
                      <CloseIcon fontSize="large" />
                    </IconButton>
                  </>
                )}
              </Box>
            )}

            {collection!.items.map((item, i) => (
              <CollectionItemCard
                key={item.attractionId}
                isEditable={isReordering}
                position={i + 1}
                onPositionChange={(newPosition) => {
                  setCollection({
                    ...collection!,
                    items: swap(collection!.items, i, newPosition - 1),
                  });
                }}
                count={collection!.items.length}
                photo={item.attractionPhoto}
                titleName={item.attractionName}
                titleUrl={`/attractions/${item.attractionId}`}
                body={
                  isReordering || !isSelf ? (
                    item.note
                  ) : (
                    <span
                      onClick={() => {
                        setNote(item.note);
                        setItemNoteDialogAttractionId(item.attractionId);
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Click to edit"
                    >
                      {item.note ? (
                        item.note
                      ) : (
                        <i style={{ color: 'gray' }}>Add note</i>
                      )}

                      <AppDialog
                        title={(item.note ? 'Edit' : 'Add') + ' note'}
                        open={itemNoteDialogAttractionId === item.attractionId}
                        onClose={() => setItemNoteDialogAttractionId(null)}
                        headerActions={
                          <IconButton
                            color="success"
                            onClick={() =>
                              handleUpdateItemNote(item.attractionId, note)
                            }
                          >
                            <CheckIcon />
                          </IconButton>
                        }
                      >
                        <TextField
                          multiline
                          rows={4}
                          fullWidth
                          sx={{ width: 500 }}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />

                        <Backdrop open={loadingUpdateItemNote}>
                          <CircularProgress />
                        </Backdrop>
                      </AppDialog>
                    </span>
                  )
                }
                actions={[
                  <div
                    onClick={() =>
                      handleUpdateCollectionThumbnail(item.attractionPhoto)
                    }
                  >
                    Set as thumbnail
                  </div>,
                  <div onClick={() => handleDeleteItem(item.attractionId)}>
                    Delete
                  </div>,
                ].filter(() => isSelf)}
              />
            ))}
          </Paper>
        )}
      </Stack>

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
