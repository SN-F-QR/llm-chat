import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import NavBar from '../components/NavBar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      void navigate('/auth');
    }
    setIsAuth(true);
  }, []);

  return (
    <div className="relative w-full">
      <NavBar isAuth={isAuth} />
      {isAuth ? <Outlet /> : <ProtectedRoute />}
    </div>
  );
};

const ProtectedRoute = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-2xl font-bold">Loading...</p>
    </div>
  );
};

export default Dashboard;
