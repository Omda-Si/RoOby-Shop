import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format.js";
import { useOrder } from "../context/OrderContext.jsx";

export function OrderTray() {
  const { count, total } = useOrder();
  if (count === 0) return null;

  return (
    <div className="order-tray">
      <div>
        <strong>{count} منتج</strong>
        <span>{formatPrice(total)}</span>
      </div>
      <Link className="btn btn-orange" to="/order">
        أكمل الطلب
      </Link>
    </div>
  );
}
