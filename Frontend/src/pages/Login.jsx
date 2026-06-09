import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext"; // Path to your AuthContext
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import banner from "../Assets/banner.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        navigate("/");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("The exact fetch error is:", err); 
      setError("Error contacting server. Check console (F12).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="banner">
          <img src={banner} alt="Online Shopping" />
        </div>

        <div className="login-content">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="mobile-input">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: "100%", border: "none", outline: "none" }} 
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="password-input"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="continue-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
            <div className="help-text" style={{ marginTop: '15px', textAlign: 'center' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;