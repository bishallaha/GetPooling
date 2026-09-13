import CustomCursor from './CustomCursor';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onSelectRole }) {
  return (
    <main className="welcome-screen">
      <CustomCursor />

      <div className="welcome-screen__ambient" aria-hidden="true">
        <span className="ambient ambient--one" />
        <span className="ambient ambient--two" />
        <span className="ambient ambient--three" />
        <span className="ambient ambient--core" />
      </div>

      <header className="welcome-screen__header">
        <h1 className="welcome-screen__brand">GetPooling</h1>
      </header>

      <section className="welcome-screen__hero" aria-labelledby="welcome-title">
        <div className="welcome-screen__copy">
          <h2 id="welcome-title" className="welcome-screen__title">
            <span className="welcome-screen__title-strong">Share the Journey.</span>
            <span className="welcome-screen__title-light">Not the hassle.</span>
          </h2>

          <p className="welcome-screen__message">
            Match with drivers and riders going your way, whenever you commute.
          </p>

          <div className="welcome-screen__ctas">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onSelectRole?.('driver')}
            >
              I'm a Driver
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onSelectRole?.('rider')}
            >
              I'm a Rider
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
