import { useEffect, useState } from 'react';
import { AttractionCollection } from '../../../app/models/attractionCollection.ts';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';

export default function useCollections(username: string) {
  const [collections, setCollections] = useState<AttractionCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.AttractionsCollections.getAll(username)
      .then((collections) => {
        setCollections(collections);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }, [username]);

  return { collections, setCollections, loading };
}
