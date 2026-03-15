import { Link } from 'react-router-dom';

const BackToDashboardButton = () => {
  return (
    <Link
      to="/dashboard"
      className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
    >
      Back to Dashboard
    </Link>
  );
};

export default BackToDashboardButton;
