import { Link, NavLink } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";

export function BottomNav() {
  const { count } = useOrder();

  return (
    <nav className="bottom-nav" aria-label="التنقل الرئيسي">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
        <span className="bottom-nav-icon" aria-hidden="true">
          ⌂
        </span>
        الرئيسية
      </NavLink>
      <a href="/#today" className="bottom-nav-item">
        <span className="bottom-nav-icon" aria-hidden="true">
          ❂
        </span>
        اليوم
      </a>
      <Link to="/order" className="bottom-nav-item order-tab">
        <span className="bottom-nav-icon" aria-hidden="true">
          ◉
        </span>
        طلبي
        {count > 0 ? <span className="nav-badge">{count}</span> : null}
      </Link>
      <a href="/#special" className="bottom-nav-item">
        <span className="bottom-nav-icon" aria-hidden="true">
          ✦
        </span>
        خاص
      </a>
      <a href="/#feedback" className="bottom-nav-item">
        <span className="bottom-nav-icon" aria-hidden="true">
          ★
        </span>
        آراء
      </a>
    </nav>
  );
}
