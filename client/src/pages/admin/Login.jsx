import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-box" onSubmit={onSubmit}>
        <img src="/logo.png" alt="RoOby" className="login-logo" />
        <div className="brand-name">RoOby Admin</div>
        <h1>دخول الإدارة</h1>
        <p className="muted">عدّل قائمة اليوم، الطلب الخاص، المناسبات، والمنتجات من هنا.</p>
        <label className="field">
          اسم المستخدم
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label className="field">
          كلمة المرور
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button className="btn btn-orange btn-block" type="submit">
          دخول
        </button>
        <Link className="login-back" to="/">
          رجوع للمتجر
        </Link>
      </form>
    </div>
  );
}
