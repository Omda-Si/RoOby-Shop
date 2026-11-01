import { createContext, useContext, useMemo, useState } from "react";

const OrderContext = createContext(null);
const STORAGE_KEY = "rooby-order";

function loadOrder() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [items, setItems] = useState(loadOrder);
  const [notice, setNotice] = useState("");

  function persist(next) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  const api = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return {
      items,
      count,
      total,
      notice,
      addItem(product, qty = 1) {
        if (!product.is_open) {
          flash("هذا المنتج خلص اليوم");
          return;
        }
        const existing = items.find((item) => item.id === product.id);
        const nextQty = (existing?.qty || 0) + qty;
        if (nextQty > product.quantity) {
          flash("الكمية دي أكبر من المتوفر");
          return;
        }
        const next = existing
          ? items.map((item) => (item.id === product.id ? { ...item, qty: nextQty } : item))
          : [...items, { id: product.id, name_ar: product.name_ar, price: product.price, qty, image_url: product.image_url }];
        persist(next);
        flash("اتضاف للطلب");
      },
      setQty(id, qty) {
        if (qty <= 0) {
          persist(items.filter((item) => item.id !== id));
          return;
        }
        persist(items.map((item) => (item.id === id ? { ...item, qty } : item)));
      },
      remove(id) {
        persist(items.filter((item) => item.id !== id));
      },
      clear() {
        persist([]);
      }
    };
  }, [items, notice]);

  return <OrderContext.Provider value={api}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  return useContext(OrderContext);
}
