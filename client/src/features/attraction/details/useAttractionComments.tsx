import { useCallback, useEffect, useState } from 'react';
import { ChatComment } from '../../../app/models/comment.ts';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { useAppSelector } from '../../../app/store/configureStore.ts';
import { toast } from 'react-toastify';
import { API_ORIGIN } from '../../../app/api/agent.ts';

export default function useAttractionComments(attractionId: string) {
  const user = useAppSelector((state) => state.account.user);
  const [comments, setComments] = useState<ChatComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNoComments, setHasNoComments] = useState(false);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null,
  );

  const clearComments = useCallback(() => {
    if (!hubConnection) return;

    setComments([]);
    hubConnection.off('ReceiveComment');
    hubConnection
      .stop()
      .then(() => {
        console.debug('Chat hub connection stopped');
        setHubConnection(null);
      })
      .catch((error) => console.warn('Error stopping connection: ', error));
  }, [hubConnection]);

  useEffect(() => {
    if (hubConnection) return;

    setLoading(true);

    const connection = new HubConnectionBuilder()
      .withUrl(API_ORIGIN + `chat?attractionId=${attractionId}`, {
        accessTokenFactory: () => user!.token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection
      .start()
      .then(() => {
        console.debug('Chat hub connection started');
        setHubConnection(connection);
      })
      .catch((error) =>
        console.warn('Error establishing the connection: ', error),
      );

    connection.on('LoadComments', (loadedComments: ChatComment[]) => {
      setComments(loadedComments);
      setLoading(false);
      setHasNoComments(loadedComments.length === 0);
    });

    connection.on('ReceiveComment', (comment: ChatComment) => {
      setHasNoComments(false);
      setComments((prevComments) => {
        return prevComments.some((c) => c.id === comment.id)
          ? prevComments
          : [comment, ...prevComments];
      });
    });

    return () => {
      clearComments();
    };
  }, [attractionId, clearComments, hubConnection, user]);

  async function addComment(body: string) {
    try {
      setLoading(true);
      await hubConnection
        ?.invoke('SendComment', { attractionId, body })
        .finally(() => setLoading(false));
    } catch (error) {
      toast.error('Error adding comment');
      console.warn(error);
    }
  }

  return { comments, addComment, loading, hasNoComments };
}
