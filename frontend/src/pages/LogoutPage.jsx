import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#020617,_#0f172a_48%,_#020617)] px-4 text-white">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 px-8 py-10 text-center">
        <p className="text-sm text-slate-300">Signing you out...</p>
      </div>
    </main>
  );
};

export default LogoutPage;
