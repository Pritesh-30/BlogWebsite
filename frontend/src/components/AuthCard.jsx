import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "../Styles/AuthCard.css";
import { useNavigate } from "react-router-dom";
import {servers} from "../environment";

export default function AuthCard() {
    // const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint = isRegister
        ? `${servers}/api/auth/register`
        : `${servers}/api/auth/login`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        setMessage("Registration successful! You can now log in.");
        setTimeout(() => {
    setIsRegister(false);
  }, 1500);
      
        // setFormData({ username: "", email: "", password: "" });
      } else {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token);// Save JWT
        localStorage.setItem("user", formData.email);
        localStorage.setItem("username", data.username);
 
        // redirect or do something after login
        console.log("Token:", data.token);
        setTimeout(() => {
           window.location.href = "/"; // or your desired page
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="toggle-buttons">
          <button
            className={!isRegister ? "active" : ""}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={isRegister ? "active" : ""}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        <div className="forms">
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className={`form login-form ${!isRegister ? "visible" : "hidden"}`}
          >
            <h2>Welcome Back</h2>
            <div className="input-box">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="submit-btn" type="submit">
              Login
            </button>
            <p className="switch-text">
              New here?{" "}
              <span onClick={() => setIsRegister(true)}>Create an account</span>
            </p>
          </form>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className={`form register-form ${isRegister ? "visible" : "hidden"}`}
          >
            <h2>Create Account</h2>
            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="submit-btn" type="submit">
              Register
            </button>
            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Login</span>
            </p>
          </form>
        </div>

        {message && (
  <p
    className={`message ${
      message.includes("successful") ? "success" : "error"
    }`}
  >
    {message}
  </p>
)}
      </div>
    </div>
  );
}
