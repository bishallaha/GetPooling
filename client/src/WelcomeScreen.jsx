import './WelcomeScreen.css';

export default function WelcomeScreen({ onSelectRole }) {
  return (
    <main className="welcome">
      <h1 className="welcome__brand">GetPooling</h1>

      <section className="welcome__hero">
        <h2>
          <span>Share the Journey.</span>
          <span>Not the hassle.</span>
        </h2>

        <p>Match with drivers and riders going your way, whenever you commute.</p>

        <div className="welcome__actions">
          <button onClick={() => onSelectRole?.('driver')}>I'm a Driver</button>
          <button onClick={() => onSelectRole?.('rider')}>I'm a Rider</button>
        </div>
      </section>
    </main>
  );
}