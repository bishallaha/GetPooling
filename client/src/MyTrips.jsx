import { useState } from 'react';
import './BrowseTrips.css';
import './MyPages.css';

const API_BASE = '/api';

function loadDriverPhone() {
  try {
    return localStorage.getItem('driverPhone') || '';
  } catch {
    return '';
  }
}

function MyTrips({ onBack }) {
  const [phone, setPhone] = useState(loadDriverPhone);
  const [loadedPhone, setLoadedPhone] = useState('');
  const [trips, setTrips] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async (driverPhone) => {
    if (!driverPhone) {
      setError('Enter the phone number you posted your trips with.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const query = `driver_phone=${encodeURIComponent(driverPhone)}`;
      const [tripsResponse, requestsResponse] = await Promise.all([
        fetch(`${API_BASE}/trips?${query}`),
        fetch(`${API_BASE}/requests?${query}`)
      ]);
      const tripsData = await tripsResponse.json().catch(() => ({}));
      const requestsData = await requestsResponse.json().catch(() => ({}));
      if (!tripsResponse.ok) throw new Error(tripsData.error || 'Something went wrong.');
      if (!requestsResponse.ok) throw new Error(requestsData.error || 'Something went wrong.');

      setTrips(tripsData);
      setRequests(requestsData);
      setLoadedPhone(driverPhone);
      try {
        localStorage.setItem('driverPhone', driverPhone);
      } catch {
        // storage unavailable, prefill just won't work next time
      }
    } catch (err) {
      setError(err instanceof TypeError ? 'Could not load your trips. Is the server running?' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAll(phone.trim());
  };

  const updateRequest = async (id, status) => {
    let failure = null;
    try {
      const response = await fetch(`${API_BASE}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
    } catch (err) {
      failure = err instanceof TypeError ? 'Could not connect to the server.' : err.message;
    }
    // Refetch even on failure so stale Approve/Reject buttons go away; then keep the PATCH error visible
    await fetchAll(loadedPhone);
    if (failure) setError(failure);
  };

  return (
    <main className="browse-page">
      <section className="browse-panel">
        <div className="browse-heading-row">
          <div>
            <h1>My Trips</h1>
            <p>See who wants to ride with you.</p>
          </div>
          <button className="back-button" type="button" onClick={onBack}>Back</button>
        </div>

        <form className="phone-form" onSubmit={handleSubmit}>
          <input placeholder="Your phone number" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <button className="search-button" type="submit">Show my trips</button>
        </form>

        {loading && <p className="status-msg">Loading your trips...</p>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && trips?.length === 0 && (
          <p className="status-msg empty">No trips found for this phone number.</p>
        )}

        <div className="trip-list">
          {trips?.map((trip) => {
            const tripRequests = requests.filter((request) => request.trip_id === trip.id);
            return (
              <article key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <h2>{trip.origin} → {trip.destination}</h2>
                  <span className="seats-badge">{trip.days} | {trip.time}</span>
                </div>
                <p><strong>Available seats:</strong> {trip.seats_available} / {trip.seats_total}</p>

                <h3 className="request-heading">Join requests</h3>
                {tripRequests.length === 0 && <p>No requests yet.</p>}
                <ul className="request-list">
                  {tripRequests.map((request) => (
                    <li key={request.id} className="request-row">
                      <span className="request-who">{request.rider_name} · {request.rider_phone}</span>
                      <span className={`status-badge ${request.status}`}>{request.status}</span>
                      {request.status === 'pending' && (
                        <div className="request-actions">
                          <button className="search-button" type="button" onClick={() => updateRequest(request.id, 'approved')}>Approve</button>
                          <button className="back-button" type="button" onClick={() => updateRequest(request.id, 'rejected')}>Reject</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default MyTrips;
