import { useState } from 'react';
import ClickableIcon from '../components/ClickableIcon.tsx';

export default function Header() {
  const picSize = '2.25em';
  const [search, setSearch] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const user = {
    username: 'john',
    picture: 'https://i.imgur.com/I0Hkyig.png',
  };

  return (
    <div
      style={{
        backgroundColor: '#a89999',
        marginBottom: '1em',
        boxShadow: '0px 4px 10px 1px rgba(0, 0, 0, 0.2)',
        padding: '0.5em 1.5em 0.5em 1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <h1 style={{ margin: 0 }}>Attractions</h1>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="search"
            placeholder="Search attractions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: '2.5em',
              width: '25em',
              borderRadius: '15px',
              border: '2px solid black',
              paddingLeft: '2em',
              marginRight: '0.7em',
            }}
          />
          <object
            data="/icons/search.svg"
            style={{ position: 'absolute', top: '12%', left: '0.25em' }}
          />
        </div>

        <ClickableIcon
          icon="/icons/add.svg"
          onClick={() => {
            console.log('Adding image');
          }}
        />
      </div>

      {isSignedIn ? (
        <div className="centered" style={{ gap: '0.5em' }}>
          <img
            src={user.picture}
            alt="user"
            style={{ borderRadius: '50%', width: picSize, height: picSize }}
          />
          {user.username}
        </div>
      ) : (
        <div className="clickable" onClick={() => setIsSignedIn(true)}>
          SIGN IN
        </div>
      )}
    </div>
  );
}
