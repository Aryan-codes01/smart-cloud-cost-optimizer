import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/actions", label: "Action Center" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-kicker">MERN FinOps Platform</span>
        <h1>Smart Cloud Cost Optimizer</h1>
        <p>Operational cloud cost visibility, optimization planning, and safe action workflows in one workspace.</p>
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
        Ready for upload, sync, forecasting, and optimization workflows
      </div>
    </aside>
  );
}
