import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import reqClient from '../service/requestClient';
import { IUser } from '../types/types';
import { useDashboardStore } from '../service/chatState';
import { useQuery } from '@tanstack/react-query';

const NavBar: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
  const [hover, setHover] = useState(false);
  const expandState = useDashboardStore((state) => state.expandChatList);
  const setExpandState = useDashboardStore((state) => state.setExpand);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!reqClient.isLogin) {
        return undefined;
      }
      const response = await reqClient.client.get<IUser>('/user/me');
      return response.data;
    },
    enabled: isAuth,
  });

  const logout = async () => {
    try {
      await reqClient.logout();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 z-20 w-full">
      <div className="flex h-12 w-full items-center justify-between overflow-hidden border-b border-gray-200 bg-white p-4 shadow-sm">
        <span className={`flex items-center space-x-2`}>
          <button
            className={`enable-animation cursor-pointer ${expandState ? '-translate-x-10' : ''}`}
            onClick={() => setExpandState(!expandState)}
          >
            {!expandState && <Menu className="size-5" />}
          </button>
          <img className="size-8 rounded-full" src="/logo.jpeg" alt="Logo" />
          <h1 className="cursor-default text-lg font-semibold">LLM Chat</h1>
        </span>
        <span
          className="flex items-center space-x-2"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            className={`${hover ? 'max-w-16' : 'max-w-0'} overflow-hidden transition-all duration-300`}
          >
            <button
              className="h-full cursor-pointer align-middle"
              onClick={() => {
                void logout();
              }}
            >
              <LogOut className="size-4 place-self-center" />
            </button>
          </div>

          <div className="flex size-8 items-center justify-center rounded-full bg-amber-400">
            <p className="cursor-default text-white/90">{userQuery.data?.name[0].toUpperCase()}</p>
          </div>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
