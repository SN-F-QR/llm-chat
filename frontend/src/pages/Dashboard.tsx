import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import NavBar from '../components/NavBar';
import ChatListBar from '../components/ChatListBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60,
    },
  },
});

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
      <QueryClientProvider client={queryClient}>
        <ChatListBar />
        {isAuth ? <Outlet /> : <ProtectedRoute />}
      </QueryClientProvider>
      <div className="sticky"></div>
    </div>
  );
};

const ProtectedRoute = () => {
  return <div className="flex h-screen w-full items-center justify-center"></div>;
};

export default Dashboard;
