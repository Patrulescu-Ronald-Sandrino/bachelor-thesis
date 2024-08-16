import { CircularProgress, Grid, Typography } from '@mui/material';
import AttractionCard from '../../attraction/list/AttractionCard.tsx';
import { useEffect, useRef, useState } from 'react';
import { Attraction, Reaction } from '../../../app/models/attraction.ts';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';

interface Props {
  username: string;
}

export default function CreatedAttractionsTab({ username }: Props) {
  const { attractions, updateReaction, loading, lastItemRef } =
    useCreatedAttractions(username);

  return (
    <Grid container spacing={4} mt={2}>
      {attractions.length === 0 ? (
        loading ? null : (
          <Grid item xs={12} className="centered">
            <Typography>This user doesn't have created attractions</Typography>
          </Grid>
        )
      ) : (
        attractions.map((attraction, i) => (
          <Grid
            item
            xs={4}
            key={i}
            ref={i === attractions.length - 1 ? lastItemRef : null}
          >
            <AttractionCard
              attraction={attraction}
              onUpdateReaction={(r) => updateReaction(attraction.id, r)}
            />
          </Grid>
        ))
      )}

      <Grid item xs={12} className="centered">
        {loading && <CircularProgress />}
      </Grid>
    </Grid>
  );
}

function useCreatedAttractions(username: string) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = (node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  function updateReaction(attractionId: string, reaction: Reaction | null) {
    const newAttractions = attractions.map((attraction) => ({
      ...attraction,
      reaction: attraction.id === attractionId ? reaction : attraction.reaction,
    }));
    setAttractions(newAttractions);
  }

  useEffect(() => {
    function fetchAttractions() {
      setLoading(true);
      agent.Attractions.created(username, page)
        .then((response) => {
          setAttractions((prevAttractions) => [
            ...prevAttractions,
            ...response.items,
          ]);
          setHasMore(
            response.pageData.currentPage < response.pageData.totalPages,
          );
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => setLoading(false));
    }

    fetchAttractions();
  }, [page, username]);

  return { attractions, updateReaction, loading, lastItemRef };
}
