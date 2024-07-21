import { useParams } from 'react-router-dom';
import useAttractionFormData from './useAttractionFormData.tsx';
import Loadable from '../../../app/layout/Loadable.tsx';
import NotFound from '../../../app/errors/NotFound.tsx';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import agent from '../../../app/api/agent.ts';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormTextInput from '../../../app/components/form/FormTextInput.tsx';
import FormSelectList from '../../../app/components/form/FormSelectList.tsx';
import useAttractionDelete from './useAttractionDelete.tsx';
import { router } from '../../../app/router/Routes.tsx';
import { toast } from 'react-toastify';

function toSelectList(items: { id: string; name: string }[]) {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

const validationSchema = yup.object().shape({
  // id: yup.string().notRequired(),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required'),
  // website: yup.string().notRequired(),
  city: yup.string().required('City is required'),
  countryId: yup.string().required('Country is required'),
  // country: yup.string().notRequired(),
  attractionTypeId: yup.string().required('Type is required'),
  // attractionType: yup.string().notRequired(),
  // file: yup.mixed().when('photoUrlList', {
  //   is: (value: string[]) => !value || value.length == 0,
  //   then: (schema) => schema.required('Please provide an image'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
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
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const watchFile = watch('file', null);

  useEffect(() => {
    if (attraction && !watchFile && !isDirty) reset(attraction);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [attraction, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      const apiCaller = isUpdate
        ? agent.Attractions.update
        : agent.Attractions.add;
      const response = await apiCaller(data);
      setAttractionFormData(response);
    } catch (e) {
      // TODO: handle errors
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
            <FormTextInput control={control} label="Name" name="name" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormSelectList
              control={control}
              label="Type"
              name="attractionTypeId"
              items={toSelectList(types)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormSelectList
              control={control}
              label="Country"
              name="countryId"
              items={toSelectList(countries)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormTextInput control={control} label="City" name="city" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormTextInput
              control={control}
              label="Address (Street, Number, Etc)"
              name="address"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormTextInput
              multiline={true}
              rows={4}
              control={control}
              name="description"
              label="Description"
            />
          </Grid>

          {/*TODO: pictures upload */}

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
