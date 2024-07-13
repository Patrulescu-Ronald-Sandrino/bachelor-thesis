import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  attractionId: string;
  initialComments: {
    username: string;
    photo: string;
    text: string;
    timestamp: string;
  }[];
}

export default function Comments({ attractionId, initialComments }: Props) {
  const maxWidth = 36;
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');

  console.log('comments for ', attractionId);

  return (
    <div
      style={{
        maxWidth: `${maxWidth}em`,
        maxHeight: '90vh',
        overflowY: 'scroll',
      }}
    >
      <textarea
        placeholder={
          'Enter your comment (Enter to submit, SHIFT + enter for new line)'
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && e.shiftKey) {
            return;
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newComments = [
              {
                username: 'user',
                photo: 'https://i.imgur.com/I0Hkyig.png',
                text: e.currentTarget.value,
                timestamp: new Date().toISOString(),
              },
              ...comments,
            ];
            setComments(newComments);
            setText('');
          }
        }}
        style={{
          resize: 'vertical',
          width: `${maxWidth}em`,
          minHeight: '1em',
          marginBottom: '1em',
        }}
      />
      {comments.map((comment, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: '1em' }}>
          <img
            src={comment.photo}
            alt={comment.username}
            style={{ width: '3em', height: '3em', borderRadius: '50%' }}
          />
          <div style={{ marginLeft: '1em' }}>
            <div style={{ display: 'flex' }}>
              <h4 style={{ margin: 0 }}>{comment.username}</h4>
              <p
                style={{
                  margin: 0,
                  marginLeft: '0.5em',
                  fontSize: '0.8em',
                  color: 'rgba(0, 0, 0, .4)',
                }}
                title={comment.timestamp}
              >
                {formatDistanceToNow(comment.timestamp)} ago
              </p>
            </div>
            <p
              style={{
                whiteSpace: 'pre-wrap',
                maxWidth: `${maxWidth - 8}em`,
              }}
            >
              {comment.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
