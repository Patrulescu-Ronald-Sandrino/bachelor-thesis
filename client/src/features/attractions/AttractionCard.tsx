import { Attraction } from '../../app/models/attraction.ts';

interface Props {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: Props) {
  return (
    <div style={{ backgroundColor: 'lightgrey' }}>
      <img
        src={attraction.mainPictureUrl}
        alt={attraction.name}
        style={{ height: '40em', width: '40em' }}
      />
      <div>
        <p style={{ margin: 0 }}>{attraction.name}</p>
        <p style={{ margin: 0 }}>{attraction.address}</p>
      </div>
    </div>
  );
}
