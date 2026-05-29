import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../molecules/Sidebar";
import { getStats } from "../../network/api/admin/stats";

export default function Layout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getStats()
      .then((res) => {
        const data = res?.data ?? res;
        setPendingCount(data?.pendingApplications ?? 0);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="gx-app">
      <Sidebar onLogout={handleLogout} pendingCount={pendingCount} />
      <div className="gx-main">
        <Outlet />
      </div>
    </div>
  );
}
