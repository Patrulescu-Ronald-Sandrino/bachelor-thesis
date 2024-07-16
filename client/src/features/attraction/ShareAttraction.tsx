import ShareIcon from '@mui/icons-material/Share';
import AppDialog from '../../app/components/AppDialog.tsx';
import { IconButton, Link, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkIcon from '@mui/icons-material/Link';
import { toast } from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import ThreadsIcon from './ThreadsIcon.tsx';

function getUrl(attraction: Attraction) {
  return `${window.location.origin}/attractions/${attraction.id}`;
}

function getShareText(attraction: Attraction) {
  return `Check out ${attraction.name} at ${getUrl(attraction)}`;
}

async function copyToClipboard(text: string) {
  return await navigator.clipboard.writeText(text);
}

interface Props {
  attraction: Attraction;
}

export default function ShareAttraction({ attraction }: Props) {
  const [shareOpen, setShareOpen] = useState(false);

  function closeShare() {
    setShareOpen(false);
  }

  const actions = [
    {
      icon: <ThreadsIcon />,
      text: 'Share to Threads',
      url: `https://www.threads.net/intent/post/?text=${getShareText(attraction)}`,
    },
    {
      icon: <TwitterIcon />,
      text: 'Share to Twitter',
      url: `https://twitter.com/share?text=${getShareText(attraction)}`,
    },
    {
      icon: <EmailIcon />,
      text: 'Share via Email',
      url: `mailto:?subject=Check out ${attraction.name}&body=${getShareText(attraction)}`,
    },
    {
      icon: <LinkIcon />,
      text: 'Copy link',
      url: '',
      onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        copyToClipboard(getUrl(attraction))
          .then(() => {
            toast.info('Link copied to clipboard.');
            closeShare();
          })
          .catch((e) => {
            console.log(e);
            toast.error('Failed to copy link to clipboard');
          });
      },
    },
  ];

  return (
    <IconButton onClick={() => setShareOpen(true)} sx={{ margin: 0 }}>
      <ShareIcon sx={{ color: 'black' }} />
      <AppDialog title="Share..." open={shareOpen} onClose={closeShare}>
        {actions.map((action) => (
          <Link
            display="flex"
            href={action.url}
            key={action.text}
            target={action.onClick ? '_self' : '_blank'}
            rel="noreferrer"
            onClick={(event) => {
              action.onClick ? action.onClick(event) : true;
            }}
            sx={{
              textDecoration: 'none',
              textTransform: 'none',
              color: 'black',
            }}
            gap={1.5}
            marginY={2.5}
            marginBottom={0}
            marginX={1}
            marginRight={4}
          >
            {action.icon}
            <Typography>{action.text}</Typography>
          </Link>
        ))}
      </AppDialog>
    </IconButton>
  );
}
