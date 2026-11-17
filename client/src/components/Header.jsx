import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";

export function Header({ shopName, search = "", onSearch }) {
  const { count } = useOrder();

  return (
    <header className="site-header">
      <div className="container header-top">
        <Link to="/" className="brand">
          <img className="brand-logo" src="/logo.png" alt={shopName || "RoOby"} />
          <span>
            <div className="brand-kicker">مرحباً بك في</div>
            <div className="brand-name">{shopName || "RoOby"}</div>
          </span>
        </Link>
        <Link to="/order" className="cart-btn" aria-label="الطلب">
          <span aria-hidden="true">🛒</span>
          {count > 0 ? <span className="cart-count">{count}</span> : null}
        </Link>
      </div>
      {typeof onSearch === "function" ? (
        <div className="container search-wrap">
          <label className="search-bar">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="ابحث عن الحلويات اللي تحبها"
              aria-label="بحث"
            />
          </label>
        </div>
      ) : null}
    </header>
  );
}
