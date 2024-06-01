export default function HomePage() {
  const isSignedIn = true;

  return (
    <div
      className="centered"
      style={{
        position: 'absolute',
        margin: '0 auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
        <object data="/icons/attraction.svg" />
        <h1 style={{ marginBottom: '0.5em' }}>Attractions</h1>
      </div>
      <p>Welcome to Attractions</p>
      {isSignedIn ? (
        <div>
          <a href={'/attractions'}>
            <button className="app-button" style={{ padding: '0.5em' }}>
              Go to Attractions
            </button>
          </a>
        </div>
      ) : (
        <div>
          <button className="app-button">Login</button>
          <button className="app-button">Register</button>
        </div>
      )}
    </div>
  );
}
