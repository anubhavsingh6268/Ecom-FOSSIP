import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext"; // Path to your AuthContext
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!agree) {
      setError("Please accept terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData), // Sends clean name, phoneNumber, email, password
      });
      
      const json = await res.json();

      if (res.ok) {
        login(json.data.user, json.data.accessToken);
        navigate("/");
      } else {
        setError(json.message || "Signup failed");
      }
    } catch (err) {
      console.error("The exact fetch error is:", err); 
      setError("Error contacting server. Check console (F12).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <form onSubmit={handleRegister}>
          <h1>Signup</h1>

          <input
            name="name"
            type="text"
            placeholder="Name"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            className="input-field"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="terms-section">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree((prev) => !prev)}
            />
            <p>
              By continuing, I agree to the terms and conditions. Age should be
              above 18.
            </p>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="continue-btn"
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Continue"}
          </button>

          <div className="help-text" style={{ marginTop: '15px', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;