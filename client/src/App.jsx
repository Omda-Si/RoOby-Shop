import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { AdminLayout } from "./pages/admin/AdminLayout.jsx";
import { CategoriesAdmin } from "./pages/admin/Categories.jsx";
import { AdminLogin } from "./pages/admin/Login.jsx";
import { ProductForm } from "./pages/admin/ProductForm.jsx";
import { ProductsAdmin } from "./pages/admin/Products.jsx";
import { AnalyticsAdmin } from "./pages/admin/Analytics.jsx";
import { CommentsAdmin } from "./pages/admin/Comments.jsx";
import { SettingsAdmin } from "./pages/admin/Settings.jsx";
import { TodayAdmin } from "./pages/admin/Today.jsx";
import { CategoryPage } from "./pages/CategoryPage.jsx";
import { Home } from "./pages/Home.jsx";
import { OrderPage } from "./pages/OrderPage.jsx";

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="empty">جاري التحميل...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<TodayAdmin />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="analytics" element={<AnalyticsAdmin />} />
        <Route path="comments" element={<CommentsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}
