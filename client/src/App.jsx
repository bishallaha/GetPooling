import { useEffect, useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import PostTrip from './PostTrip';
import BrowseTrips from './BrowseTrips';

function getPageFromPath() {
  if (window.location.pathname === '/rider') return 'rider';
  if (window.location.pathname === '/driver') return 'driver';
  return 'home';
}

function App() {
  const [page, setPage] = useState(getPageFromPath);

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goTo = (nextPage) => {
    const nextPath = nextPage === 'home' ? '/' : `/${nextPage}`;
    window.history.pushState({}, '', nextPath);
    setPage(nextPage);
  };

  if (page === 'driver') {
    return <PostTrip />;
  }

  if (page === 'rider') {
    return <BrowseTrips onBack={() => goTo('home')} />;
  }

  return <WelcomeScreen onSelectRole={(role) => goTo(role)} />;
}

export default App;
