import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import reqClient from '../service/requestClient';
import { IUser } from '../types/types';

const NavBar: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const loginUser = async () => {
      try {
        if (!reqClient.isLogin) {
          return;
        }
        const response = await reqClient.client.get<IUser>('/user/me');
        setUser(response.data);
        console.log('setting user');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    void loginUser();
  }, [isAuth]);

  const logout = async () => {
    try {
      await reqClient.logout();
      console.log('Logout successful');
      setUser(undefined);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="sticky top-0 z-20">
      <div className="flex h-12 w-full items-center justify-between overflow-hidden border-b border-gray-200 bg-white p-4 shadow-sm">
        <span className="flex items-center space-x-2">
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
            <p className="cursor-default text-white/90">{user?.name[0].toUpperCase()}</p>
          </div>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
