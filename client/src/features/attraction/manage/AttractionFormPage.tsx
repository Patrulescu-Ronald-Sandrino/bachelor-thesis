import { useBeforeUnload, useParams } from 'react-router-dom';
import useAttractionFormData from './useAttractionFormData.tsx';
import Loadable from '../../../app/layout/Loadable.tsx';
import NotFound from '../../../app/errors/NotFound.tsx';
import * as yup from 'yup';
import { Control, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect } from 'react';
import agent from '../../../app/api/agent.ts';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormTextInput from '../../../app/components/form/FormTextInput.tsx';
import FormSelectList from '../../../app/components/form/FormSelectList.tsx';
import useAttractionDelete from './useAttractionDelete.tsx';
import { router } from '../../../app/router/Routes.tsx';
import { toast } from 'react-toastify';
import {
  AttractionAddOrEditDto,
  AttractionPhotosDto,
} from '../../../app/models/attraction.ts';
import FormPhotos from './FormPhotos.tsx';

function toSelectList(items: { id: string; name: string }[]) {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

const validationSchema: yup.ObjectSchema<AttractionAddOrEditDto> = yup
  .object()
  .shape({
    id: yup.string().optional(),
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    address: yup.string().required('Address is required'),
    website: yup.string().required('Website is required'),
    city: yup.string().required('City is required'),
    countryId: yup.string().required('Country is required'),
    attractionTypeId: yup.string().required('Type is required'),
    photos: yup
      .array()
      .of(
        yup.object().shape({
          newPhoto: yup.mixed<File>().optional().nullable(),
          currentUrl: yup.string().optional().nullable(),
          preview: yup.string().optional().nullable(),
        }),
      )
      .required()
      .test('photoRequired', 'At least One photo is required', (photos) => {
        return photos.some((p) => p.newPhoto || p.currentUrl);
      }),
  });

export default function AttractionFormPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, attraction, types, countries, setAttractionFormData } =
    useAttractionFormData(id);
  const isUpdate = !!id && !!attraction;
  const { deleteAttraction, isDeleting } = useAttractionDelete();
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
    setValue,
  } = useForm<AttractionAddOrEditDto>({
    resolver: yupResolver(validationSchema),
  });
  const watchPhotos = watch('photos');

  useEffect(() => {
    if (attraction && !watchPhotos && !isDirty) reset(attraction);
    return () => {
      if (!watchPhotos) return;
      watchPhotos.forEach((attractionPhotosDto: AttractionPhotosDto) => {
        if (attractionPhotosDto.preview) {
          URL.revokeObjectURL(attractionPhotosDto.preview);
          attractionPhotosDto.preview = undefined;
        }
      });
    };
  }, [attraction, reset, watchPhotos, isDirty]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
        }
      },
      [isDirty],
    ),
    { capture: true },
  );

  async function handleSubmitData(data: AttractionAddOrEditDto) {
    try {
      const apiCaller = isUpdate
        ? agent.Attractions.update
        : agent.Attractions.add;
      const response = await apiCaller(data);
      setAttractionFormData(response);
    } catch (e) {
      console.log(e);
    }
  }

  if (loading) return <Loadable loading={loading} />;
  if (!!id && !attraction) return <NotFound />;

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5">
          {isUpdate ? 'Edit' : 'Add'} attraction
        </Typography>

        {isUpdate && (
          <LoadingButton
            disabled={isSubmitting}
            loading={isDeleting}
            variant="contained"
            color="warning"
            onClick={() => {
              deleteAttraction(id)
                .then(() => {
                  toast.success('Attraction deleted');
                  return router.navigate('/attractions');
                })
                .catch((error) => toast.error(error));
            }}
          >
            Delete
          </LoadingButton>
        )}
      </Box>

      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormTextInput
              control={control as unknown as Control}
              label="Name"
              name="name"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormSelectList
              control={control as unknown as Control}
              label="Type"
              name="attractionTypeId"
              items={toSelectList(types)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormSelectList
              control={control as unknown as Control}
              label="Country"
              name="countryId"
              items={toSelectList(countries)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormTextInput
              control={control as unknown as Control}
              label="City"
              name="city"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormTextInput
              control={control as unknown as Control}
              label="Address (Street, Number, Etc)"
              name="address"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormTextInput
              multiline={true}
              rows={4}
              control={control as unknown as Control}
              name="description"
              label="Description"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormPhotos control={control} name="photos" setValue={setValue} />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1.5}
            >
              <Button
                disabled={isDeleting || isSubmitting}
                variant="contained"
                color="inherit"
                onClick={() => reset(attraction)}
              >
                Cancel
              </Button>

              <LoadingButton
                disabled={isDeleting}
                loading={isSubmitting}
                type="submit"
                variant="contained"
                color="success"
              >
                Submit
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
