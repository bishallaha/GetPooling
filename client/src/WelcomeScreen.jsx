import './WelcomeScreen.css';

function WelcomeScreen({ onRider }) {
  return (
    <main className="welcome-screen">
      <button type="button" onClick={onRider}>
        I'm a rider
      </button>
    </main>
  );
}

export default WelcomeScreen;
