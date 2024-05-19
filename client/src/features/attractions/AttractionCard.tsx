import { Attraction } from '../../app/models/attraction.ts';
import ClickableIcon from '../../app/components/ClickableIcon.tsx';

const imageSize = '37em';

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
    city: attraction.cityId,
    address: attraction.address,
    website: <a href={attraction.website}>{attraction.website}</a>,
  };

  return (
    <div style={{ backgroundColor: 'lightgrey' }}>
      <img
        src={attraction.mainPictureUrl}
        alt={attraction.name}
        style={{ height: imageSize, width: imageSize }}
      />
      <div style={{ display: 'flex', margin: '1em' }}>
        <div>
          <h3 title="name" style={attractionPropertyTitle}>
            {attraction.name}
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
