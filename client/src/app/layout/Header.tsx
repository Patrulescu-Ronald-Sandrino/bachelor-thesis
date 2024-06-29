import { useState } from 'react';
import Menu from '../components/Menu.tsx';
import { useLocation } from 'react-router-dom';
import ClickableIcon from '../components/ClickableIcon.tsx';
import { useAppDispatch, useAppSelector } from '../store/configureStore.ts';
import { signOut } from '../../features/account/accountSlice.ts';

export default function Header() {
  const picSize = '2em';
  const [search, setSearch] = useState('');
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const menuItems = [
    {
      name: 'Profile',
      action: () => (window.location.href = '/profile'),
    },
    {
      name: 'Log out',
      action: () => dispatch(signOut()),
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
        <ClickableIcon
          icon={'/icons/attraction.svg'}
          onClick={() => (window.location.href = '/')}
          title={'Go to home page'}
        />
        <a href={'/attractions'} className={'no-style'}>
          <h1 style={{ margin: 0 }}>Attractions</h1>
        </a>
      </div>

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
          <button
            className={'app-button'}
            onClick={() => window.history.go(-1)}
          >
            BACK
          </button>
        ) : (
          <a href={'/attractions/add'}>
            <img src={'/icons/add.svg'} alt="add" />
          </a>
        )}
      </div>

      <div style={{ marginRight: '3em', marginLeft: '3em' }}>
        <Menu items={menuItems}>
          <div className="centered" style={{ gap: '0.8em', marginLeft: '3em' }}>
            <img
              src={user!.image || 'avatar.png'}
              alt="user"
              style={{ borderRadius: '50%', width: picSize, height: picSize }}
            />
            {user!.username}
          </div>
        </Menu>
      </div>
    </div>
  );
}
