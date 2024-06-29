import { useAppSelector } from '../../app/store/configureStore.ts';
import Link from '../../app/components/Link.tsx';

export default function HomePage() {
  const { user } = useAppSelector((state) => state.account);

  return (
    <div className={'centered-both'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
        <object data="/icons/attraction.svg" />
        <h1 style={{ marginBottom: '0.5em' }}>Attractions</h1>
      </div>
      <p>Welcome to Attractions</p>
      {user ? (
        <div>
          <Link href={'/attractions'} text={'Go to Attractions'} />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5em' }}>
          <Link href={'/login'} text={'Login'} />
          <Link href={'/register'} text={'Register'} />
        </div>
      )}
    </div>
  );
}
