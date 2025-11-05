import React, { useState, useEffect } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Styles/Header.css";
import { toast } from "react-toastify";
import logo from "../Assets/image.png"; // ✅ Add your logo image here

export default function Header() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const categories = ["Git", "React", "Javascript", "Tech", "Anime", "UI/UX", "Career", "Personal"];

  const handleCreate = () => {
    const token = localStorage.getItem("token");
    if (token) navigate("/create");
    else {
      toast.info("Please log in to create a blog");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    setUsername(storedUser || "");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.classList.toggle("dark-mode", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  return (
    <header className="header">
      {/* ---- Left ---- */}
      <div className="header-left">
        {/* ✅ Logo added */}
        <img
          src={logo}
          alt="Code Unscripted Logo"
          className="site-logo"
          onClick={() => navigate("/")}
        />

        <button onClick={() => navigate("/")} className="nav-btn">All Posts</button>
        

        {/* Dropdown */}
        <div className="dropdown-container posts-dropdown">
          <button className="nav-btn domain-btn">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span className="posts-icon">⋮≡</span> Posts <ChevronDown size={12} style={{ marginLeft: '4px' }}/>
            </span>
          </button>

          <div className="dropdown-menu">
            {categories.map((cat) => (
              <span
                key={cat}
                className="dropdown-item"
                onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Right ---- */}
      <div className="header-right">
        {/* <button onClick={toggleTheme} className="toggle-btn">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button> */}

       
          <button className="auth-btn create-btn" onClick={handleCreate}>
            Create Your Blog
          </button>
        

        {isLoggedIn ? (
          <div className="user-section">
            <span className="welcome-text">Hi, {username || "User"}</span>
            <button onClick={handleLogout} className="auth-btn logout-btn">Logout</button>
          </div>
        ) : (
          <button className="auth-btn login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
