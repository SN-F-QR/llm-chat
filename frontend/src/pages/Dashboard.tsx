import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';

const Dashboard = () => {
  return (
    <div className="relative w-full">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
