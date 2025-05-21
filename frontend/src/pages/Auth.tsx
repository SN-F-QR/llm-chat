import { useNavigate, Outlet } from 'react-router';
import { useEffect } from 'react';

const Auth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      void navigate('/');
    }
  }, []);

  return (
    <div className="flex w-full justify-center">
      <Outlet />
    </div>
  );
};

export default Auth;
