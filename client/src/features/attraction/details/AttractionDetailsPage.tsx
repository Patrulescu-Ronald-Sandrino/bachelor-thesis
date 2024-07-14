import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { Attraction } from '../../../app/models/attraction.ts';
import Loadable from '../../../app/layout/Loadable.tsx';
import NotFound from '../../../app/errors/NotFound.tsx';

export default function AttractionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Attractions.fetch(id!)
      .then((response) => setAttraction(response))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (!loading && !attraction) return <NotFound />;

  return <Loadable loading={loading}>{attraction!.name}</Loadable>;
}
