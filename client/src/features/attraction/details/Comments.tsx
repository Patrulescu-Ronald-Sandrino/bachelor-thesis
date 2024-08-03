import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import useAttractionComments from './useAttractionComments.tsx';
import { formatDistanceToNow } from 'date-fns';
import { Control, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormTextInput from '../../../app/components/form/FormTextInput.tsx';

interface Props {
  attractionId: string;
}

function formatDate(date: Date) {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    fractionalSecondDigits: 3,
  });
}

export default function Comments({ attractionId }: Props) {
  const { comments, addComment, loading } = useAttractionComments(attractionId);
  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ body: string }>({
    defaultValues: { body: '' },
    resolver: yupResolver(yup.object({ body: yup.string().required() })),
    mode: 'onChange',
  });

  return (
    <Grid item xs={6}>
      <Paper>
        <Typography variant="h5" align="center" py={1}>
          Comments
        </Typography>

        <FormTextInput
          placeholder="Enter your comment (Enter to submit, SHIFT + enter for new line)"
          multiline={true}
          rows={3}
          control={control as unknown as Control}
          name="body"
          hideError={true}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              return;
            }
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              isValid &&
                handleSubmit(({ body }) => addComment(body))().then(() =>
                  reset(),
                );
            }
          }}
        />

        {loading && (
          <Box display="flex" justifyContent="center" padding={1}>
            <CircularProgress />
          </Box>
        )}

        {comments.map((comment) => (
          <Box
            key={comment.id}
            display="flex"
            alignItems="flex-start"
            padding={2}
            gap={2}
          >
            <Avatar src={comment.authorPhoto} />

            <Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography fontWeight="bold">
                  {comment.authorUsername}
                </Typography>
                <Typography
                  title={formatDate(comment.createdAt)}
                  variant="caption"
                  color="gray"
                  paddingX={1}
                >
                  {formatDistanceToNow(comment.createdAt)} ago
                </Typography>
              </Box>
              <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                {comment.body}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </Grid>
  );
}
