import { useEffect, useState } from 'react';
import agent from '../../../app/api/agent.ts';
import { Country } from '../../../app/models/country.ts';
import { AttractionType } from '../../../app/models/attractionType.ts';
import {
  AttractionAddOrEditDto,
  AttractionFormData,
  AttractionPhotosDto,
} from '../../../app/models/attraction.ts';

export default function useAttractionFormData(id?: string) {
  const [loading, setLoading] = useState(true);

  const [countries, setCountries] = useState<Country[]>([]);
  const [types, setTypes] = useState<AttractionType[]>([]);
  const [attraction, setAttraction] = useState<AttractionAddOrEditDto>(
    {} as AttractionAddOrEditDto,
  );

  function setAttractionFormData(response: AttractionFormData) {
    setCountries(response.countries);
    setTypes(response.types);
    if (!response.attraction) return;
    const photos = response.attraction.photos.map(
      (url) =>
        ({
          currentUrl: url,
          newPhoto: null,
          preview: null,
        }) as AttractionPhotosDto,
    );
    const attractionForEdit = {
      ...response.attraction,
      photos,
    } as AttractionAddOrEditDto;
    setAttraction(attractionForEdit);
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
