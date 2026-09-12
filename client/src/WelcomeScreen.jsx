import './WelcomeScreen.css';

export default function WelcomeScreen({ onSelectRole }) {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-screen__brand">GetPooling</h1>

      <div className="welcome-screen__content">
        <p className="welcome-screen__message">
          Find a driver or rider for your daily commute — the same route,
          the same people, every day.
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
    </div>
  );
}
