import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand-name">RoOby</div>
        <p className="muted">مرحباً {user?.username}</p>
        <NavLink to="/admin" end>
          إدارة منتجات اليوم
        </NavLink>
        <NavLink to="/admin/products">المنتجات</NavLink>
        <NavLink to="/admin/categories">التصنيفات</NavLink>
        <NavLink to="/admin/analytics">تحليل المبيعات</NavLink>
        <NavLink to="/admin/comments">تعليقات الزبائن</NavLink>
        <NavLink to="/admin/settings">إعدادات المحل</NavLink>
        <a href="/" target="_blank" rel="noreferrer">
          فتح المتجر الأونلاين
        </a>
        <button type="button" onClick={onLogout}>
          خروج
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
