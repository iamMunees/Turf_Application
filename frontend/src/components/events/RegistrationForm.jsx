import { useState } from 'react';
import { useEvents } from '../../context/EventsContext';
import { defaultFormValues, formatPrice } from '../../utils/events';

const RegistrationForm = ({ event, onComplete }) => {
  const { registerForEvent, registrations } = useEvents();
  const [formValues, setFormValues] = useState(defaultFormValues);

  const isRegistered = registrations.some((registration) => registration.eventId === event.id);

  const handleChange = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    registerForEvent(event, formValues);
    onComplete?.();
  };

  if (isRegistered) {
    return (
      <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">Registered</p>
        <h3 className="mt-3 text-xl font-semibold text-white">You already have a confirmed spot.</h3>
        <p className="mt-2 text-sm text-emerald-50/90">Check the registrations dashboard to review or cancel it.</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/70">Register Now</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{event.name}</h3>
        </div>
        <p className="rounded-full bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-100">
          {formatPrice(event.fee)}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          <span>Name</span>
          <input
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300/45"
            value={formValues.name}
            onChange={(eventValue) => handleChange('name', eventValue.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-200">
          <span>Email</span>
          <input
            required
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300/45"
            value={formValues.email}
            onChange={(eventValue) => handleChange('email', eventValue.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-200">
          <span>Phone</span>
          <input
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300/45"
            value={formValues.phone}
            onChange={(eventValue) => handleChange('phone', eventValue.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-200">
          <span>Age Group</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300/45"
            value={formValues.ageGroup}
            onChange={(eventValue) => handleChange('ageGroup', eventValue.target.value)}
          >
            <option value="Under 16">Under 16</option>
            <option value="16-18">16-18</option>
            <option value="18+">18+</option>
            <option value="35+">35+</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-amber-300 px-5 py-3 font-semibold text-slate-950"
      >
        Register Now
      </button>
    </form>
  );
};

export default RegistrationForm;
