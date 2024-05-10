import { Attraction } from '../../app/models/attraction.ts';

interface Props {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: Props) {
  return (
    <div>
      <span>{attraction.name}</span>
      <span>{attraction.address}</span>
      <img src={attraction.mainPictureUrl} alt={attraction.name} />
    </div>
  );
}
