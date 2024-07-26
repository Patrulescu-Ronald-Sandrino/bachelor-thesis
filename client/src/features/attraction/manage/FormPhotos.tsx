import {
  UseControllerProps,
  useFieldArray,
  UseFormSetValue,
  useFormState,
} from 'react-hook-form';
import {
  Box,
  Card,
  CardActions,
  CardMedia,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import SelectList from '../../../app/components/SelectList.tsx';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AttractionAddOrEditDto,
  AttractionPhotosDto,
} from '../../../app/models/attraction.ts';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { generate } from '../../../app/util/array.ts';

const dzStyles = {
  display: 'flex',
  border: 'dashed 3px #eee',
  borderColor: 'gray',
  borderRadius: '5px',
  paddingTop: '30px',
  alignItems: 'center',
  height: 200,
  width: 300,
};

const dzActive = {
  borderColor: 'green',
};

interface Props extends UseControllerProps<AttractionAddOrEditDto> {
  setValue: UseFormSetValue<AttractionAddOrEditDto>;
}

export default function FormPhotos(props: Props) {
  const { errors } = useFormState({ ...props });
  const { fields, append, swap } = useFieldArray({
    ...props,
    name: 'photos',
  });
  const [newPhoto, setNewPhoto] = useState<AttractionPhotosDto | null>(null);
  const [cropper, setCropper] = useState<Cropper>();

  const clearPreview = useCallback(() => {
    if (newPhoto?.preview) {
      URL.revokeObjectURL(newPhoto.preview);
    }
  }, [newPhoto]);

  function createPhoto(file: File): AttractionPhotosDto {
    return {
      newPhoto: file,
      preview: URL.createObjectURL(file),
      currentUrl: null,
    };
  }

  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, [clearPreview]);

  const changePhoto = useCallback((file: File | null) => {
    // clearPreview();

    if (!file) {
      setNewPhoto(null);
    } else {
      setNewPhoto(createPhoto(file));
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      changePhoto(acceptedFiles[0]);
    },
    [changePhoto],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          append(createPhoto(blob as File));
          changePhoto(null);
        }
      });
    }
  }

  return (
    <>
      <Typography>Photos</Typography>

      <Grid container spacing={2}>
        {fields.map((photo, currentIndex) => (
          <Grid item xs={3} key={photo.id}>
            <Card>
              <CardMedia
                image={photo.preview || photo.currentUrl || ''}
                style={{ height: 0, paddingTop: '56.25%' }}
              />
              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <SelectList
                  label="Position"
                  selectedValue={currentIndex + 1}
                  items={generate(1, fields.length)}
                  onChange={(newPosition) => {
                    swap(currentIndex, newPosition - 1);
                  }}
                />
                <IconButton
                  onClick={() => {
                    // remove(currentIndex);
                    const newPhotos = fields.filter(
                      (_, index) => index !== currentIndex,
                    );
                    props.setValue('photos', newPhotos, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FormHelperText error sx={{ mt: 1 }}>
        {errors.photos?.message}
      </FormHelperText>

      <Grid container marginTop={5}>
        <UploadStepContainer text="Step 1 - Add Photo">
          <div
            {...getRootProps()}
            style={{
              cursor: 'pointer',
            }}
          >
            <FormControl
              style={{ ...dzStyles, ...(isDragActive ? { ...dzActive } : {}) }}
            >
              <input {...getInputProps()} />
              <UploadFile sx={{ fontSize: '100px' }} />
              <Typography variant="subtitle2">
                Drop image here
                <br />
                or click to open file picker
              </Typography>
            </FormControl>
          </div>
        </UploadStepContainer>

        <UploadStepContainer text="Step 2 - Resize image">
          {newPhoto && newPhoto.preview && (
            <Cropper
              src={newPhoto.preview}
              style={{ height: 200, width: '100%' }}
              initialAspectRatio={1}
              aspectRatio={16 / 9}
              preview=".img-preview"
              guides={false}
              viewMode={1}
              autoCropArea={1}
              background={false}
              onInitialized={(cropper) => setCropper(cropper)}
            />
          )}
        </UploadStepContainer>

        <UploadStepContainer text="Step 3 - Preview & Upload">
          {newPhoto && (
            <>
              <div
                className="img-preview"
                style={{
                  minHeight: '200px',
                  width: '100%',
                  overflow: 'hidden',
                }}
              ></div>
              <Box>
                <IconButton onClick={onCrop} color="success">
                  <CheckIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={() => changePhoto(null)} color="error">
                  <CloseIcon fontSize="large" />
                </IconButton>
              </Box>
            </>
          )}
        </UploadStepContainer>
      </Grid>
    </>
  );
}

function UploadStepContainer({
  children,
  text,
}: PropsWithChildren<{ text: string }>) {
  return (
    <Grid
      item
      xs={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="subtitle1" color="teal">
        {text}
      </Typography>

      {children}
    </Grid>
  );
}
