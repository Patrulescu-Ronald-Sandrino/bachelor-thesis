import { useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import axios from 'axios';

export default function Attractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  useEffect(() => {
    axios.get('http://localhost:7000/api/attractions').then((response) => {
      console.log(response);
      setAttractions(response.data);
    });
  }, []);

  return (
    <>
      <h1>Attractions</h1>
      <ol>
        {attractions.map((attraction) => (
          <li key={attraction.id}>{attraction.name}</li>
        ))}
      </ol>
    </>
  );
}
