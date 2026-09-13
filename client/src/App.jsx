import { useEffect, useState } from 'react';
import BrowseTrips from './BrowseTrips';
import WelcomeScreen from './WelcomeScreen';

function getPageFromPath() {
  return window.location.pathname === '/rider' ? 'rider' : 'home';
}

function App() {
  const [page, setPage] = useState(getPageFromPath);

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goTo = (nextPage) => {
    const nextPath = nextPage === 'rider' ? '/rider' : '/';
    window.history.pushState({}, '', nextPath);
    setPage(nextPage);
  };

  if (page === 'rider') {
    return <BrowseTrips onBack={() => goTo('home')} />;
  }

  return <WelcomeScreen onSelectRole={(role) => role === 'rider' && goTo('rider')} />;
}

export default App;
