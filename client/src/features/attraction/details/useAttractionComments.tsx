import { useCallback, useEffect, useState } from 'react';
import { ChatComment } from '../../../app/models/comment.ts';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { useAppSelector } from '../../../app/store/configureStore.ts';
import { toast } from 'react-toastify';

export default function useAttractionComments(attractionId: string) {
  const user = useAppSelector((state) => state.account.user);
  const [comments, setComments] = useState<ChatComment[]>([]);
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
        console.log('Chat hub connection stopped');
        setHubConnection(null);
      })
      .catch((error) => console.log('Error stopping connection: ', error));
  }, [hubConnection]);

  useEffect(() => {
    if (hubConnection) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`http://localhost:7000/chat?attractionId=${attractionId}`, {
        accessTokenFactory: () => user!.token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log('Chat hub connection started');
        setHubConnection(connection);
      })
      .catch((error) =>
        console.log('Error establishing the connection: ', error),
      );

    connection.on('LoadComments', (loadedComments: ChatComment[]) => {
      loadedComments.forEach((comment) => {
        comment.createdAt = new Date(comment.createdAt + 'Z');
      });
      setComments(loadedComments);
    });

    connection.on('ReceiveComment', (comment: ChatComment) => {
      comment.createdAt = new Date(comment.createdAt);
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
      await hubConnection?.invoke('SendComment', { attractionId, body });
    } catch (error) {
      toast.error('Error adding comment');
      console.log(error);
    }
  }

  return { comments, addComment };
}
