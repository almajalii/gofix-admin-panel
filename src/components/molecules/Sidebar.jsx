import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  IconHome,
  IconClipboard,
  IconUsers,
  IconCalendar,
  IconFlagNav,
  IconTag,
  IconStarNav,
  IconLogout,
  IconFeedback,
  IconBell,
  IconEarnings,
  IconMap,
} from "../atoms/Icons";

function GoFixLogo({ collapsed }) {
  return (
    <div className="gx-logo">
      <div className="gx-logo-mark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="var(--accent)" />
          <path
            d="M8.5 12a3.5 3.5 0 1 0 6.3 -2.1l1.7 -1.7l-1.5 -1.5l-1.7 1.7A3.5 3.5 0 0 0 8.5 12z"
            fill="#fff"
          />
          <circle cx="11.5" cy="12" r="1.2" fill="var(--accent)" />
        </svg>
      </div>
      {!collapsed && (
        <div className="gx-logo-text">
          <div className="gx-logo-name">GoFix</div>
          <div className="gx-logo-sub">Admin</div>
        </div>
      )}
    </div>
  );
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <IconHome />, to: "/dashboard" },
  {
    id: "applications",
    label: "Applications",
    icon: <IconClipboard />,
    to: "/applications",
    badge: true,
  },
  { id: "users", label: "Users", icon: <IconUsers />, to: "/users" },
  {
    id: "bookings",
    label: "Bookings",
    icon: <IconCalendar />,
    to: "/bookings",
  },
  { id: "areas", label: "Areas", icon: <IconMap />, to: "/areas" },
  {
    id: "earnings",
    label: "Earnings",
    icon: <IconEarnings />,
    to: "/earnings",
  },
  {
    id: "categories",
    label: "Categories",
    icon: <IconTag />,
    to: "/categories",
  },
  { id: "reviews", label: "Reviews", icon: <IconStarNav />, to: "/reviews" },
  { id: "reports", label: "Reports", icon: <IconFlagNav />, to: "/reports" },
  {
    id: "feedback",
    label: "Feedback",
    icon: <IconFeedback />,
    to: "/feedback",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <IconBell />,
    to: "/notifications",
  },
];

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A"
  );
}

export default function Sidebar({ onLogout, pendingCount = 0 }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const admin = useSelector((state) => state.adminAuth.admin);

  const adminName = admin
    ? `${admin.firstName || ""} ${admin.lastName || ""}`.trim()
    : "Admin";
  const initials = getInitials(adminName);

  return (
    <aside className={`gx-sidebar ${collapsed ? "gx-sidebar-collapsed" : ""}`}>
      <div className="gx-sidebar-top">
        <GoFixLogo collapsed={collapsed} />
        <button
          className="gx-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d={collapsed ? "M5 3l5 5l-5 5" : "M10 3l-5 5l5 5"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="gx-nav">
        {NAV.map(({ id, label, icon, to, badge }) => (
          <button
            key={id}
            className={`gx-nav-item ${pathname.startsWith(to) ? "is-active" : ""}`}
            onClick={() => navigate(to)}
            title={collapsed ? label : ""}
          >
            <span className="gx-nav-icon">{icon}</span>
            {!collapsed && <span className="gx-nav-label">{label}</span>}
            {!collapsed && badge && pendingCount > 0 && (
              <span className="gx-nav-badge">{pendingCount}</span>
            )}
            {collapsed && badge && pendingCount > 0 && (
              <span className="gx-nav-badge-dot" />
            )}
          </button>
        ))}
      </nav>

      <div className="gx-sidebar-bottom">
        <div className="gx-admin-card">
          <div
            className="gx-avatar gx-avatar-fallback"
            style={{
              width: collapsed ? 32 : 36,
              height: collapsed ? 32 : 36,
              fontSize: 13,
            }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="gx-admin-meta">
              <div className="gx-admin-name">{adminName}</div>
              <div className="gx-admin-role">Super Admin</div>
            </div>
          )}
        </div>
        <button
          className="gx-nav-item gx-logout"
          onClick={onLogout}
          title={collapsed ? "Log out" : ""}
        >
          <span className="gx-nav-icon">
            <IconLogout />
          </span>
          {!collapsed && <span className="gx-nav-label">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
