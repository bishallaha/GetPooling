import { useState } from 'react';
import './PostTrip.css';

export default function PostTrip() {
  const [form, setForm] = useState({
    driver_name: '',
    driver_phone: '',
    vehicle_info: '',
    origin: '',
    destination: '',
    days: '',
    time: '',
    seats: ''
  });

  const [message, setMessage] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        return;
      }

      setMessage('Trip posted successfully.');

      setForm({
        driver_name: '',
        driver_phone: '',
        vehicle_info: '',
        origin: '',
        destination: '',
        days: '',
        time: '',
        seats: ''
      });
    } catch {
      setMessage('Could not connect to the server.');
    }
  }

  return (
    <main className="post-trip">
      <div className="post-trip__card">
        <h1>Post a Trip</h1>
        <p>Share your regular commute with riders going your way.</p>

        <form onSubmit={handleSubmit}>
          <input name="driver_name" placeholder="Your name" value={form.driver_name} onChange={handleChange} />
          <input name="driver_phone" placeholder="Phone number" value={form.driver_phone} onChange={handleChange} />

          <div className="form-row">
            <input name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} />
            <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} />
          </div>

          <div className="form-row">
            <input name="days" placeholder="Days (e.g. Mon, Wed, Fri)" value={form.days} onChange={handleChange} />
            <input name="time" type="time" value={form.time} onChange={handleChange} />
          </div>

          <div className="form-row">
            <input name="seats" type="number" min="1" placeholder="Seats" value={form.seats} onChange={handleChange} />
            <input name="vehicle_info" placeholder="Vehicle model & plate" value={form.vehicle_info} onChange={handleChange} />
          </div>

          <button type="submit">Post trip</button>

          {message && <p className="post-trip__message">{message}</p>}
        </form>
      </div>
    </main>
  );
}