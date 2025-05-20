import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import NavBar from '../components/NavBar';

const Dashboard = () => {
  return (
    <div className="relative w-full">
      <NavBar />
      <ProtectedRoute />
    </div>
  );
};

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      void navigate('/login');
    }
    setIsAuth(true);
  }, []);

  if (isAuth) {
    return <Outlet />;
  } else {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    );
  }
};

export default Dashboard;
