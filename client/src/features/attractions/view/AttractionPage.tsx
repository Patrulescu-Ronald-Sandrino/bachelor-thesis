import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { Attraction } from '../../../app/models/attraction.ts';
import AttractionCardContainer from './AttractionCardContainer.tsx';

export default function AttractionPage() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);

  useEffect(() => {
    agent.Attractions.fetch(id!)
      .then((response) => setAttraction(response))
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <>
      {attraction ? (
        <AttractionCardContainer attraction={attraction} />
      ) : (
        <div>Not found....</div>
      )}
    </>
  );
}
