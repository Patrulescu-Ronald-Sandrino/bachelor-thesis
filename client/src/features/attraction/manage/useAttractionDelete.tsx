import { useState } from 'react';
import agent from '../../../app/api/agent.ts';

export default function useAttractionDelete() {
  const [loading, setLoading] = useState(false);

  async function deleteAttraction(id: string) {
    setLoading(true);
    return await agent.Attractions.delete(id).finally(() => setLoading(false));
  }

  return {
    deleteAttraction,
    isDeleting: loading,
  };
}
