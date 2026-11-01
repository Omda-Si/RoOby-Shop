import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <form className="login-box" onSubmit={onSubmit}>
      <div className="brand-name">RoOby</div>
      <h1>دخول الإدارة</h1>
      <p className="muted">من هنا بتعدّل حلويات اليوم، الخبر، واللي يظهر للزبائن.</p>
      <label className="field">
        اسم المستخدم
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label className="field">
        كلمة المرور
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error ? <p className="muted">{error}</p> : null}
      <button className="btn btn-orange" type="submit">
        دخول
      </button>
    </form>
  );
}
