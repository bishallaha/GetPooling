import { useEffect, useState } from 'react';
import './BrowseTrips.css';

const API_BASE = 'http://localhost:3000/api';

function BrowseTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ origin: '', destination: '', day: '' });

  const fetchTrips = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(query).filter(([, v]) => v))
      );
      const res = await fetch(`${API_BASE}/trips?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch trips');
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      setError('Could not load trips. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrips(filters);
  };

  const handleClear = () => {
    const cleared = { origin: '', destination: '', day: '' };
    setFilters(cleared);
    fetchTrips(cleared);
  };

  return (
    <div className="browse-trips">
      <h1>Browse Trips</h1>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input
          name="origin"
          placeholder="Origin"
          value={filters.origin}
          onChange={handleFilterChange}
        />
        <input
          name="destination"
          placeholder="Destination"
          value={filters.destination}
          onChange={handleFilterChange}
        />
        <input
          name="day"
          placeholder="Day (e.g. Mon)"
          value={filters.day}
          onChange={handleFilterChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      {loading && <p className="status-msg">Loading trips...</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && trips.length === 0 && (
        <p className="status-msg empty">
          No trips match your search. Try different filters or check back later.
        </p>
      )}

      <div className="trip-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <div className="trip-card-header">
              <h3>{trip.origin} \u2192 {trip.destination}</h3>
              <span className={trip.seats_available > 0 ? 'seats-open' : 'seats-full'}>
                {trip.seats_available > 0
                  ? `${trip.seats_available} seat${trip.seats_available > 1 ? 's' : ''} left`
                  : 'Full'}
              </span>
            </div>
            <p><strong>Driver:</strong> {trip.driver_name}</p>
            <p><strong>Vehicle:</strong> {trip.vehicle_info}</p>
            <p><strong>Days:</strong> {trip.days}</p>
            <p><strong>Time:</strong> {trip.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseTrips;
