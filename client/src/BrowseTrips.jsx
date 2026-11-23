import { useEffect, useState } from 'react';
import './BrowseTrips.css';
import './MyPages.css';

const API_BASE = '/api';

function loadRider() {
  try {
    return JSON.parse(localStorage.getItem('rider')) || { name: '', phone: '' };
  } catch {
    return { name: '', phone: '' };
  }
}

function BrowseTrips({ onBack, onMyRequests }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ origin: '', destination: '', day: '' });
  const [rider, setRider] = useState(loadRider);
  const [joinTripId, setJoinTripId] = useState(null);
  const [joinResults, setJoinResults] = useState({});

  const fetchTrips = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(query).filter(([, value]) => value))
      );
      const response = await fetch(`${API_BASE}/trips?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch trips');
      setTrips(await response.json());
    } catch (err) {
      setError('Could not load trips. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchTrips(filters);
  };

  const handleClear = () => {
    const clearedFilters = { origin: '', destination: '', day: '' };
    setFilters(clearedFilters);
    fetchTrips(clearedFilters);
  };

  const handleRiderChange = (event) => {
    setRider({ ...rider, [event.target.name]: event.target.value });
  };

  const handleJoin = async (event, tripId) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/trips/${tripId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rider_name: rider.name, rider_phone: rider.phone })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setJoinResults((prev) => ({ ...prev, [tripId]: { error: data.error || 'Something went wrong.' } }));
        return;
      }
      setJoinResults((prev) => ({ ...prev, [tripId]: { pending: true } }));
      setJoinTripId(null);
      try {
        localStorage.setItem('rider', JSON.stringify({ name: rider.name.trim(), phone: rider.phone.trim() }));
      } catch {
        // storage unavailable, prefill just won't work next time
      }
    } catch {
      setJoinResults((prev) => ({ ...prev, [tripId]: { error: 'Could not connect to the server.' } }));
    }
  };

  return (
    <main className="browse-page">
      <section className="browse-panel">
        <div className="browse-heading-row">
          <div>
            <h1>Browse Trips</h1>
            <p>Find a regular commute that works for you.</p>
          </div>
          <div className="heading-actions">
            <button className="back-button" type="button" onClick={onMyRequests}>My requests</button>
            <button className="back-button" type="button" onClick={onBack}>Back</button>
          </div>
        </div>

        <form className="filter-bar" onSubmit={handleSearch}>
          <input name="origin" placeholder="Origin" value={filters.origin} onChange={handleFilterChange} />
          <input name="destination" placeholder="Destination" value={filters.destination} onChange={handleFilterChange} />
          <input name="day" placeholder="Days (e.g. Mon, Wed, Fri)" value={filters.day} onChange={handleFilterChange} />
          <button className="search-button" type="submit">Search trips</button>
          <button className="clear-button" type="button" onClick={handleClear}>Clear filters</button>
        </form>

        {loading && <p className="status-msg">Loading trips...</p>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && trips.length === 0 && (
          <p className="status-msg empty">No trips match your search. Try different filters or check back later.</p>
        )}

        <div className="trip-list">
          {trips.map((trip) => (
            <article key={trip.id} className="trip-card">
              <div className="trip-card-header">
                <h2>{trip.origin} → {trip.destination}</h2>
                <span className={trip.seats_available > 0 ? 'seats-badge seats-open' : 'seats-badge seats-full'}>
                  {trip.seats_available > 0 ? `${trip.seats_available} seat${trip.seats_available > 1 ? 's' : ''} left` : 'Full'}
                </span>
              </div>
              <p><strong>Driver:</strong> {trip.driver_name}</p>
              <p><strong>Vehicle:</strong> {trip.vehicle_info}</p>
              <p><strong>Days:</strong> {trip.days}</p>
              <p><strong>Time:</strong> {trip.time}</p>

              {joinResults[trip.id]?.pending ? (
                <p className="request-note">Request pending</p>
              ) : joinTripId === trip.id ? (
                <form className="join-form" onSubmit={(event) => handleJoin(event, trip.id)}>
                  <input name="name" placeholder="Your name" value={rider.name} onChange={handleRiderChange} />
                  <input name="phone" placeholder="Phone number" value={rider.phone} onChange={handleRiderChange} />
                  <button className="search-button" type="submit">Send</button>
                  <button className="back-button" type="button" onClick={() => setJoinTripId(null)}>Cancel</button>
                </form>
              ) : trip.seats_available > 0 && (
                <button className="search-button join-button" type="button" onClick={() => setJoinTripId(trip.id)}>Request to join</button>
              )}
              {joinResults[trip.id]?.error && <p className="card-error">{joinResults[trip.id].error}</p>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BrowseTrips;
