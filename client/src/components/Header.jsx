import { Link, NavLink } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";

export function Header({ shopName }) {
  const { count } = useOrder();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img className="brand-logo" src="/logo.png" alt={shopName || "RoOby"} />
          <span>
            <div className="brand-name">{shopName || "RoOby"}</div>
            <div className="brand-sub">متجر حلويات أونلاين</div>
          </span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            الرئيسية
          </NavLink>
          <a href="/#today">المتوفّر اليوم</a>
          <a href="/#festival">المناسبات</a>
          <a href="/#special">طلب خاص</a>
          <a href="/#categories">التصنيفات</a>
          <NavLink to="/order">الطلب</NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/order" className="btn btn-orange">
            اطلب أونلاين {count > 0 ? `(${count})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
