import { Outlet } from 'react-router-dom';
import Sidebar from '../molecules/Sidebar';

export default function Layout() {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="gx-app">
      <Sidebar onLogout={handleLogout} />
      <div className="gx-main">
        <Outlet />
      </div>
    </div>
  );
}