import { useEffect, useState } from 'react';
import './BrowseTrips.css';

const API_BASE = 'http://localhost:3000/api';

function BrowseTrips({ onBack }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ origin: '', destination: '', day: '' });

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

  return (
    <main className="browse-page">
      <section className="browse-panel">
        <div className="browse-heading-row">
          <div>
            <h1>Browse Trips</h1>
            <p>Find a regular commute that works for you.</p>
          </div>
          <button className="back-button" type="button" onClick={onBack}>
            Back
          </button>
        </div>

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
            placeholder="Days (e.g. Mon, Wed, Fri)"
            value={filters.day}
            onChange={handleFilterChange}
          />
          <button className="search-button" type="submit">
            Search trips
          </button>
          <button className="clear-button" type="button" onClick={handleClear}>
            Clear filters
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
            <article key={trip.id} className="trip-card">
              <div className="trip-card-header">
                <h2>{trip.origin} → {trip.destination}</h2>
                <span className={trip.seats_available > 0 ? 'seats-badge seats-open' : 'seats-badge seats-full'}>
                  {trip.seats_available > 0
                    ? `${trip.seats_available} seat${trip.seats_available > 1 ? 's' : ''} left`
                    : 'Full'}
                </span>
              </div>
              <p><strong>Driver:</strong> {trip.driver_name}</p>
              <p><strong>Vehicle:</strong> {trip.vehicle_info}</p>
              <p><strong>Days:</strong> {trip.days}</p>
              <p><strong>Time:</strong> {trip.time}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BrowseTrips;
