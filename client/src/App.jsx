import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import PostTrip from './PostTrip';
import BrowseTrips from './BrowseTrips';

function App() {
  const [role, setRole] = useState(null);

  if (role === 'driver') {
    return <PostTrip />;
  }

  if (role === 'rider') {
    return <BrowseTrips />;
  }

  return <WelcomeScreen onSelectRole={setRole} />;
}

export default App;