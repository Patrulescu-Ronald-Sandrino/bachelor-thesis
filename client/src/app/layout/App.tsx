import Header from './Header.tsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Header />
      <div style={{ marginLeft: '1em', marginRight: '1em' }}>
        <Outlet />
      </div>
    </>
  );
}

export default App;
