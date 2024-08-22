import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AttractionType } from '../../../app/models/attractionType.ts';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';
import Loadable from '../../../app/layout/Loadable.tsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const IconButtonStyled = styled(IconButton)(`
  padding: 0;
`);

export default function AttractionTypesPage() {
  const [types, setTypes] = useState<AttractionType[]>([]);

  const [loading, setLoading] = useState(true);

  const [indexEditType, setIndexEditType] = useState<number | null>(null);
  const isEditing = indexEditType !== null;
  const isAdding = indexEditType === types.length;

  const listItemStyle = (i: number) => ({
    marginY: Number(indexEditType !== i),
  });

  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    agent.AttractionTypes.list()
      .then((response) => setTypes(response))
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loadable loading={loading} target="attraction types" />;

  function handleCancelEdit() {
    setIndexEditType(null);
  }

  function handleAddType(value: string) {
    setLoadingEdit(true);
    agent.AttractionTypes.add(value)
      .then((response) => {
        setTypes([...types, response]);
        setIndexEditType(null);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoadingEdit(false));
  }

  function handleUpdateType(index: number, value: string) {
    setLoadingEdit(true);
    agent.AttractionTypes.update(types[index].id, value)
      .then((response) => {
        const newTypes = [...types];
        newTypes[index] = response;
        setTypes(newTypes);
        setIndexEditType(null);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoadingEdit(false));
  }

  function handleDeleteType(index: number) {
    setLoadingEdit(true);
    agent.AttractionTypes.delete(types[index].id)
      .then(() => {
        const newTypes = [...types];
        newTypes.splice(index, 1);
        setTypes(newTypes);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoadingEdit(false));
  }

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h4" className="centered-flex">
        Attraction Types
      </Typography>

      <Stack component={'ol'}>
        {types.map((type, i) => (
          <Box component={'li'} sx={listItemStyle(i)} key={type.id}>
            <Box display="flex" gap={1} alignItems="center">
              {indexEditType === i ? (
                <EditForm
                  onSave={(value) => handleUpdateType(i, value)}
                  onCancel={handleCancelEdit}
                  initialValue={type.name}
                />
              ) : (
                <Typography>{type.name}</Typography>
              )}

              <Typography variant="body2">{`(${type.usages} usages)`}</Typography>

              {!isEditing && (
                <>
                  <IconButtonStyled
                    title="Rename"
                    color="inherit"
                    size="small"
                    onClick={() => setIndexEditType(i)}
                    sx={{ padding: 0 }}
                  >
                    <EditIcon />
                  </IconButtonStyled>

                  {type.usages === 0 && (
                    <IconButtonStyled
                      title="Delete"
                      color="inherit"
                      size="small"
                      onClick={() => handleDeleteType(i)}
                    >
                      <DeleteIcon />
                    </IconButtonStyled>
                  )}
                </>
              )}
            </Box>
          </Box>
        ))}

        <Box component={'li'} sx={listItemStyle(types.length)}>
          {isAdding ? (
            <EditForm onSave={handleAddType} onCancel={handleCancelEdit} />
          ) : (
            <Typography
              color="gray"
              title="Add"
              onClick={() => setIndexEditType(types.length)}
              fontStyle="italic"
            >
              Add new
            </Typography>
          )}
        </Box>
      </Stack>

      <Backdrop open={loadingEdit}>
        <CircularProgress />
      </Backdrop>
    </Paper>
  );
}

interface EditFormProps {
  onSave: (value: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

const MuiTypographyRootLineHeight = '1.5rem';

function EditForm({ onSave, onCancel, initialValue = '' }: EditFormProps) {
  const [value, setValue] = useState(initialValue);
  const isFormValid = value.trim().length > 0 && value !== initialValue;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{
          sx: { paddingY: 1 },
          style: { height: MuiTypographyRootLineHeight },
        }}
      />

      <IconButtonStyled
        color={isFormValid ? 'success' : 'warning'}
        style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
        title="Save"
        onClick={() => {
          if (isFormValid) onSave(value);
        }}
      >
        <CheckIcon />
      </IconButtonStyled>

      <IconButtonStyled color="error" title="Cancel" onClick={onCancel}>
        <CloseIcon />
      </IconButtonStyled>
    </Box>
  );
}
