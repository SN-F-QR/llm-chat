import { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import NavBar from '../components/NavBar';
import ChatListBar from '../components/ChatListBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import reqClient from '@/service/requestClient';

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
  const chatListDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!reqClient.isLogin) {
      void navigate('/auth');
    }
    setIsAuth(true);
  }, []);

  return (
    <div className="relative h-full max-h-screen w-full overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <NavBar isAuth={isAuth} />
        <div className="flex w-full">
          <ChatListBar scrollRef={chatListDivRef} />
          {isAuth ? <Outlet context={chatListDivRef} /> : <ProtectedRoute />}
        </div>
      </QueryClientProvider>
      <div className="sticky"></div>
    </div>
  );
};

const ProtectedRoute = () => {
  return <div className="flex h-screen w-full items-center justify-center"></div>;
};

export default Dashboard;
