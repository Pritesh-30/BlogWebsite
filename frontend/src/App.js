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
import StarSky from "react-star-sky";

function App() {
  return (
    <Router>
      {/* 🌌 Background Layer */}
      <div className="starry-container">
        <StarSky
          className="starry-background"
          starColor="#ffffff"
          backgroundColor="#0e071c"
          starSize={1.5}
          numStars={500}
          isTwinkling={true}
        />
      </div>

      {/* 🌍 Foreground Content */}
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/login" element={<AuthCard />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
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
