import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { Attraction } from '../../../app/models/attraction.ts';
import Loadable from '../../../app/layout/Loadable.tsx';
import NotFound from '../../../app/errors/NotFound.tsx';
import { Container, Grid } from '@mui/material';
import { AttractionCard } from './AttractionCard.tsx';
import Comments from './Comments.tsx';

export default function AttractionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    agent.Attractions.fetch(id!)
      .then((response) => setAttraction(response))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loadable loading={loading} />;
  if (!attraction) return <NotFound />;

  function toggleComments() {
    setShowComments((prevState) => !prevState);
  }

  const attractionCard = (
    <AttractionCard attraction={attraction} toggleComments={toggleComments} />
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
