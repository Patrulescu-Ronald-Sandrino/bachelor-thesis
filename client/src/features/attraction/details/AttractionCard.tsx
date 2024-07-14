import { Attraction } from '../../../app/models/attraction.ts';
import ClickableIcon from '../../../app/components/ClickableIcon.tsx';
import AttractionCardPictures from './AttractionCardPictures.tsx';

const attractionProperty = {
  margin: 0,
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
};

const attractionPropertyTitle = {
  ...attractionProperty,
  fontWeight: 'bold',
  marginTop: '0.5rem',
};

const descriptionStyle = {
  backgroundColor: '#A89D9D',
  width: '100%',
  margin: '0.25em',
  paddingLeft: '0.5em',
  paddingTop: '0.25em',
};

interface Props {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: Props) {
  const leftSideProperties = {
    type: 'Museum',
    city: attraction.city,
    address: attraction.address,
  };

  return (
    <div style={{ backgroundColor: 'lightgrey' }}>
      <AttractionCardPictures />

      <div style={{ display: 'flex', margin: '1em' }}>
        <div>
          <h3
            title="Go to attraction's website"
            style={attractionPropertyTitle}
          >
            <a href={attraction.website} className="link">
              {attraction.name}
            </a>
          </h3>

          {Object.entries(leftSideProperties).map(([name, value]) => (
            <p title={name} style={attractionProperty} key={name}>
              <img
                src={`/icons/${name}.svg`}
                alt={name}
                style={{ marginRight: '0.5rem' }}
              ></img>
              {value}
            </p>
          ))}

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ClickableIcon
              icon="/icons/save.svg"
              onClick={() => console.log('clicked save')}
            />
            <div style={{ margin: '0.5em' }}></div>
            <ClickableIcon
              icon="/icons/share.svg"
              onClick={() => console.log('clicked share')}
            />
          </div>
        </div>

        <div title="description" style={descriptionStyle}>
          {attraction.description}
        </div>
      </div>
    </div>
  );
}
