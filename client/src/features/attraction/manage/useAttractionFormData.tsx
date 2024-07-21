import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { Country } from '../../../app/models/country.ts';
import { AttractionType } from '../../../app/models/attractionType.ts';
import {
  Attraction,
  AttractionFormData,
} from '../../../app/models/attraction.ts';

export default function useAttractionFormData(id?: string) {
  const [loading, setLoading] = useState(true);

  const [countries, setCountries] = useState<Country[]>([]);
  const [types, setTypes] = useState<AttractionType[]>([]);
  const [attraction, setAttraction] = useState<Attraction | null>(null);

  function setAttractionFormData(response: AttractionFormData) {
    setCountries(response.countries);
    setTypes(response.types);
    setAttraction(response.attraction);
  }

  useEffect(() => {
    agent.Attractions.getFormData(id)
      .then(setAttractionFormData)
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  return {
    loading,
    countries,
    types,
    attraction,
    setAttractionFormData,
  };
}
