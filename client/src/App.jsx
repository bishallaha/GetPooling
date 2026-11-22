import { useEffect, useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import PostTrip from './PostTrip';
import BrowseTrips from './BrowseTrips';
import MyTrips from './MyTrips';
import MyRequests from './MyRequests';

const PAGES = ['rider', 'driver', 'driver/trips', 'rider/requests'];

function getPageFromPath() {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  return PAGES.includes(path) ? path : 'home';
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
    return <PostTrip onMyTrips={() => goTo('driver/trips')} />;
  }

  if (page === 'driver/trips') {
    return <MyTrips onBack={() => goTo('driver')} />;
  }

  if (page === 'rider') {
    return <BrowseTrips onBack={() => goTo('home')} onMyRequests={() => goTo('rider/requests')} />;
  }

  if (page === 'rider/requests') {
    return <MyRequests onBack={() => goTo('rider')} />;
  }

  return <WelcomeScreen onSelectRole={(role) => goTo(role)} />;
}

export default App;
