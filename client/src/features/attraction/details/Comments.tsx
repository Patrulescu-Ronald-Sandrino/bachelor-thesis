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
import MouseOverPopover from '../../../app/components/MouseOverPopover.tsx';

import ProfileCard from '../../common/ProfileCard.tsx';
import { ReactNode } from 'react';
import { formatDateDetailed, stringToDate } from '../../../app/util/date.ts';

interface Props {
  attractionId: string;
}

export default function Comments({ attractionId }: Props) {
  const { comments, addComment, loading, hasNoComments } =
    useAttractionComments(attractionId);
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
    <Grid item xs={6} sx={{ height: '100%' }}>
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
          fullWidth
        />

        <Box maxHeight={627} sx={{ overflowY: 'auto' }}>
          <Box display="flex" justifyContent="center" padding={1}>
            {loading ? (
              <CircularProgress />
            ) : (
              hasNoComments && <Typography>No comments yet</Typography>
            )}
          </Box>

          {comments.map((comment) => {
            const ProfileCardPopover = ({
              children,
            }: {
              children: ReactNode;
            }) => (
              <MouseOverPopover
                popoverContent={
                  <ProfileCard
                    username={comment.authorUsername}
                    photo={comment.authorPhoto}
                  />
                }
              >
                {children}
              </MouseOverPopover>
            );

            return (
              <Box
                key={comment.id}
                display="flex"
                alignItems="flex-start"
                padding={2}
                gap={2}
              >
                <ProfileCardPopover>
                  <Avatar src={comment.authorPhoto} />
                </ProfileCardPopover>

                <Box>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <ProfileCardPopover>
                      <Typography fontWeight="bold">
                        {comment.authorUsername}
                      </Typography>
                    </ProfileCardPopover>

                    <Typography
                      title={formatDateDetailed(comment.createdAt)}
                      variant="caption"
                      color="gray"
                      paddingX={1}
                    >
                      {formatDistanceToNow(stringToDate(comment.createdAt))} ago
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {comment.body}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Grid>
  );
}
