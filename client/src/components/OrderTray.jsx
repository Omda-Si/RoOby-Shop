import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format.js";
import { useOrder } from "../context/OrderContext.jsx";

export function OrderTray() {
  const { count, total } = useOrder();
  if (count === 0) {
    return null;
  }

  return (
    <div className="order-tray">
      <div>
        {count} منتج في الطلب • {formatPrice(total)}
      </div>
      <Link className="btn" to="/order">
        اطلب عبر واتساب
      </Link>
    </div>
  );
}
