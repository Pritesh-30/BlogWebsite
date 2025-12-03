// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CreateBlog from "./pages/CreateBlog";
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthCard from "./components/AuthCard";
import EditBlog from "./pages/EditBlog";
import MyBlogs from "./pages/MyBlogs";
import { useTheme } from "./context/ThemeContext";
import Starfield from "./components/Starfield";


function App() {
  const { theme, colors } = useTheme();
  return (
    <Router>
      {/* 🌌 Background Layer */}
<Starfield />   {/* ⭐ No crashes, smooth star background */}


      {/* 🌍 Foreground Content */}
      <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/login" element={<AuthCard />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/blogs/edit/:id" element={<EditBlog />} />
          <Route path="/myblogs" element={<MyBlogs />} />
        </Routes>

        <Footer />

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;