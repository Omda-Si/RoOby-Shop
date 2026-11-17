import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { to: "/admin", label: "منتجات اليوم", end: true, icon: "◎" },
  { to: "/admin/products", label: "المنتجات", icon: "▤" },
  { to: "/admin/categories", label: "التصنيفات", icon: "✦" },
  { to: "/admin/analytics", label: "تحليل المبيعات", icon: "▴" },
  { to: "/admin/comments", label: "تعليقات الزبائن", icon: "★" },
  { to: "/admin/settings", label: "إعدادات المحل", icon: "⚙" }
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell foodcort-admin">
      <aside className="admin-side">
        <div className="admin-brand">
          <img src="/logo.png" alt="RoOby" className="admin-logo" />
          <div>
            <div className="brand-name">RoOby</div>
            <p className="admin-user">مرحباً {user?.username}</p>
          </div>
        </div>

        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <span className="admin-nav-icon" aria-hidden="true">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-side-actions">
          <a className="admin-shop-link" href="/" target="_blank" rel="noreferrer">
            فتح المتجر الأونلاين
          </a>
          <button type="button" className="admin-logout" onClick={onLogout}>
            خروج
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
