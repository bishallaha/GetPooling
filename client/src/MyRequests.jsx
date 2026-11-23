import { useEffect, useState } from 'react';
import './BrowseTrips.css';
import './MyPages.css';

const API_BASE = '/api';

function loadRiderPhone() {
  try {
    return JSON.parse(localStorage.getItem('rider'))?.phone || '';
  } catch {
    return '';
  }
}

function MyRequests({ onBack }) {
  const [phone, setPhone] = useState(loadRiderPhone);
  const [loadedPhone, setLoadedPhone] = useState('');
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // silent = background refresh, no "Loading..." flash
  const fetchRequests = async (riderPhone, silent = false) => {
    if (!riderPhone) {
      setError('Enter the phone number you requested trips with.');
      return;
    }

    if (!silent) setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/requests?rider_phone=${encodeURIComponent(riderPhone)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setRequests(data);
      setLoadedPhone(riderPhone);
    } catch (err) {
      setError(err instanceof TypeError ? 'Could not load your requests. Is the server running?' : err.message);
    } finally {
      setLoading(false);
    }
  };

  // ponytail: polls every 5s; switch to server-sent events if many users ever hit this
  useEffect(() => {
    if (!loadedPhone) return;
    const timer = setInterval(() => fetchRequests(loadedPhone, true), 5000);
    return () => clearInterval(timer);
  }, [loadedPhone]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchRequests(phone.trim());
  };

  return (
    <main className="browse-page">
      <section className="browse-panel">
        <div className="browse-heading-row">
          <div>
            <h1>My Requests</h1>
            <p>Check whether drivers have accepted you.</p>
          </div>
          <button className="back-button" type="button" onClick={onBack}>Back</button>
        </div>

        <form className="phone-form" onSubmit={handleSubmit}>
          <input placeholder="Your phone number" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <button className="search-button" type="submit">Show my requests</button>
        </form>

        {loading && <p className="status-msg">Loading your requests...</p>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && requests?.length === 0 && (
          <p className="status-msg empty">You have not requested any trips yet.</p>
        )}

        <div className="trip-list">
          {requests?.map((request) => (
            <article key={request.id} className="trip-card">
              <div className="trip-card-header">
                <h2>{request.origin} → {request.destination}</h2>
                <span className={`status-badge ${request.status}`}>{request.status}</span>
              </div>
              <p><strong>Driver:</strong> {request.driver_name}</p>
              <p><strong>When:</strong> {request.days} | {request.time}</p>
              {request.status === 'approved' && (
                <a className="search-button call-button" href={`tel:${request.driver_phone}`}>Call driver</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MyRequests;
