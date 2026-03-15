import { useState } from 'react';
import { bookingOptions, sports } from '../data/mockData';
import SectionHeader from './SectionHeader';

const BookingPanel = () => {
  const [selectedSport, setSelectedSport] = useState(sports[0]);
  const [selectedLocation, setSelectedLocation] = useState(bookingOptions.locations[0]);
  const [selectedDate, setSelectedDate] = useState(bookingOptions.dates[0]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
      <SectionHeader
        eyebrow="Slot Booking"
        title="Book facilities in three taps"
        description="Select the sport, pick a city and date, then lock the best available slot."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[{ label: 'Sport', value: selectedSport, values: sports, setter: setSelectedSport }, { label: 'Location', value: selectedLocation, values: bookingOptions.locations, setter: setSelectedLocation }, { label: 'Date', value: selectedDate, values: bookingOptions.dates, setter: setSelectedDate }].map((field) => (
          <label key={field.label} className="space-y-2">
            <span className="text-sm text-slate-300">{field.label}</span>
            <select
              value={field.value}
              onChange={(event) => field.setter(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0"
            >
              {field.values.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {bookingOptions.slots.map((slot) => (
          <div
            key={slot.id}
            className={`rounded-3xl border p-5 ${
              slot.available ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-white/10 bg-white/5 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{slot.time}</p>
                <p className="mt-1 text-sm text-slate-300">
                  {selectedSport} at {slot.venue}, {selectedLocation}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
                {slot.price}
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {slot.available ? 'Available now' : 'Booked out'}
              </span>
              <button
                disabled={!slot.available}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookingPanel;
