import { useNavigate, Outlet } from 'react-router';
import { useEffect } from 'react';
import reqClient from '@/service/requestClient';

const Auth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (reqClient.isLogin) {
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
