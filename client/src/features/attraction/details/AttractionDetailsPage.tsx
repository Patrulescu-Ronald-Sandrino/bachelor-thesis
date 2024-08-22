import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { Attraction } from '../../../app/models/attraction.ts';
import Loadable from '../../../app/layout/Loadable.tsx';
import NotFoundPage from '../../../app/errors/NotFoundPage.tsx';
import { Container, Grid } from '@mui/material';
import { AttractionCard } from './AttractionCard.tsx';
import Comments from './Comments.tsx';
import { CollectionsContextProvider } from '../../common/collections/CollectionsContext.tsx';
import { useCollectionsContext } from '../../common/collections/useCollectionsContext.tsx';

export default function AttractionDetailsPage() {
  return (
    <CollectionsContextProvider>
      <AttractionDetailsPageInner />
    </CollectionsContextProvider>
  );
}

function AttractionDetailsPageInner() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loadingAttraction, setLoadingAttraction] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const { loading: loadingCollections } = useCollectionsContext();
  const loading = loadingAttraction || loadingCollections;

  useEffect(() => {
    agent.Attractions.fetch(id!)
      .then((response) => setAttraction(response))
      .catch((error) => console.log(error))
      .finally(() => setLoadingAttraction(false));
  }, [id]);

  if (loading) return <Loadable loading={loading} target="attraction" />;
  if (!attraction) return <NotFoundPage />;

  function toggleComments() {
    setShowComments((prevState) => !prevState);
  }

  const attractionCard = (
    <AttractionCard
      attraction={attraction}
      toggleComments={toggleComments}
      onUpdateReaction={(reaction) =>
        setAttraction({ ...attraction, reaction })
      }
    />
  );

  return (
    <Container>
      <Grid container columnSpacing={4}>
        {showComments ? (
          <>
            {attractionCard}
            <Comments attractionId={attraction.id} />
          </>
        ) : (
          <>
            <Grid item xs={3} />
            {attractionCard}
            <Grid item xs={3} />
          </>
        )}
      </Grid>
    </Container>
  );
}
