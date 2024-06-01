import { useState } from 'react';
import Menu from '../components/Menu.tsx';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const picSize = '2em';
  const [search, setSearch] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { pathname } = useLocation();

  const user = {
    username: 'john',
    picture: 'https://i.imgur.com/I0Hkyig.png',
  };

  const menuItems = [
    {
      name: 'Profile',
      action: () => alert('Profile'),
    },
    {
      name: 'My attractions',
      action: () => alert('My attractions'),
    },
    {
      name: 'Log out',
      action: () => setIsSignedIn(false),
    },
  ];

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
      <a href={'/'} className={'no-style'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
          <object data="/icons/attraction.svg" />
          <h1 style={{ margin: 0 }}>Attractions</h1>
        </div>
      </a>

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

        {pathname.includes('/attractions/add') ? (
          <a href={'/attractions'}>
            <button className={'app-button'}>BACK</button>
          </a>
        ) : (
          <a href={'/attractions/add'}>
            <img src={'/icons/add.svg'} alt="add" />
          </a>
        )}
      </div>

      <div style={{ marginRight: '3em', marginLeft: '3em' }}>
        {isSignedIn ? (
          <Menu items={menuItems}>
            <div
              className="centered"
              style={{ gap: '0.8em', marginLeft: '3em' }}
            >
              <img
                src={user.picture}
                alt="user"
                style={{ borderRadius: '50%', width: picSize, height: picSize }}
              />
              {user.username}
            </div>
          </Menu>
        ) : (
          <div className="clickable" onClick={() => setIsSignedIn(true)}>
            SIGN IN
          </div>
        )}
      </div>
    </div>
  );
}
