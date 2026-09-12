import WelcomeScreen from './WelcomeScreen';

function App() {
  return <WelcomeScreen onSelectRole={(role) => console.log(role)} />;
}

export default App;