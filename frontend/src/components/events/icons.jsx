export const Icon = ({ path, className = 'h-5 w-5', viewBox = '0 0 24 24' }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox={viewBox}
  >
    <path d={path} />
  </svg>
);

export const LocationPinIcon = ({ className }) => (
  <Icon className={className} path="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
);

export const HeartIcon = ({ className, filled = false }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d="M12 20.5 4.8 13.8a4.9 4.9 0 0 1 6.9-6.96L12 7.1l.3-.27a4.9 4.9 0 0 1 6.9 6.95L12 20.5Z" />
  </svg>
);

export const SearchIcon = ({ className }) => (
  <Icon className={className} path="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
);

export const GridIcon = ({ className }) => (
  <Icon className={className} path="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
);

export const ListIcon = ({ className }) => (
  <Icon className={className} path="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
);

export const FilterIcon = ({ className }) => (
  <Icon className={className} path="M4 6h16M7 12h10M10 18h4" />
);

export const CalendarIcon = ({ className }) => (
  <Icon className={className} path="M8 2v4M16 2v4M3 10h18M5 5h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
);

export const UsersIcon = ({ className }) => (
  <Icon className={className} path="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87M9 7a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" />
);

export const ShareIcon = ({ className }) => (
  <Icon className={className} path="M14 6 10 10m0 0-4 4m4-4 4 4m-4-4V3M4 21h16" />
);

export const MapIcon = ({ className }) => (
  <Icon className={className} path="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z M9 4v14 M15 6v14" />
);

export const StarIcon = ({ className }) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="m12 3.8 2.5 5.08 5.6.82-4.05 3.95.95 5.58L12 16.55l-5 2.68.96-5.58L3.9 9.7l5.6-.82L12 3.8Z" />
  </svg>
);

export const ChevronDownIcon = ({ className }) => <Icon className={className} path="m6 9 6 6 6-6" />;
