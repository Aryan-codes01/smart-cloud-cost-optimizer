import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/actions", label: "Action Center" },
  { to: "/kubernetes", label: "Kubernetes" },
  { to: "/architecture", label: "System Design" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-kicker">MERN FinOps Platform</span>
        <h1>Smart Cloud Cost Optimizer</h1>
        <p>College-demo friendly on the outside, startup-grade architecture underneath.</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        Ready for upload, sync, forecast, and optimization demos
      </div>
    </aside>
  );
}
