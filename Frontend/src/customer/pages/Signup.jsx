import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginApi } from "../api/auth";
import "./Signup.css";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (!agree) {
      setError("Please accept terms and conditions");
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      const loginRes = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      const loggedInUser = loginRes.data.data.user;
      const token = loginRes.data.data.accessToken;
      login(loggedInUser, token);

      navigate(loggedInUser?.role === "seller" ? "/seller" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Signup</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-field"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
        />

        <select
          name="role"
          className="input-field"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">Customer</option>
          <option value="seller">Seller</option>
        </select>

        <div className="terms-section">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <p>I agree to the terms and conditions.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        {successMessage && <p className="success-text">{successMessage}</p>}

        <button
          className="continue-btn"
          disabled={loading}
          onClick={handleRegister}
        >
          {loading ? "Please Wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Signup;
