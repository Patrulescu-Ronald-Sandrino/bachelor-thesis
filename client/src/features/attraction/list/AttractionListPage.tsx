import { useEffect, useState } from 'react';
import { Attraction } from '../../../app/models/attraction.ts';
import agent from '../../../app/api/agent.ts';
import Loadable from '../../../app/layout/Loadable.tsx';

export default function AttractionListPage() {
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  useEffect(() => {
    agent.Attractions.list()
      .then((response) => setAttractions(response))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Loadable loading={loading}>
      {attractions.map((attraction) => (
        <div key={attraction.id}>{attraction.name}</div>
      ))}
    </Loadable>
  );
}
