// src/pages/BlogList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../Styles/BlogList.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  return (
    <div className="blog-page">
      {/* 🌐 Website Name & Tagline */}
      {/* <div className="blog-header">
  <h1 className="site-name">
    <span className="code-text">CODE</span>{" "}
    <span className="unscripted-text">UNSCRIPTED</span>
  </h1> */}
  {/* <p className="site-tagline">Innovate. Automate. Create. 🚀</p> */}
{/* </div> */}


      {/* 🧱 Blog Cards */}
      <div className="blog-list-container">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="blog-card"
            onClick={() => navigate(`/blogs/${blog._id}`)}
          >
             {/* ✅ Thumbnail */}
  {blog.thumbnailUrl && (
    <div className="thumbnail-container">
      <img src={blog.thumbnailUrl} alt={blog.title} className="thumbnail-img" />
    </div>
  )}
            {/* Tags Section */}
            <div className="blog-tags">
              {(blog.tags && blog.tags.length > 0
                ? blog.tags
                : ["React", "WebDev"]
              ).slice(0, 3).map((tag, index) => (
                <span key={index} className="blog-tag">{tag}</span>
              ))}
            </div>

            {/* Title */}
            <h3 className="blog-title">{blog.title}</h3>

            {/* Description */}
            <p className="blog-description">{blog.twoLineDescription}</p>

            {/* Footer */}
            {/* Footer */}
<div className="blog-footer">
  {/* ❤️ Likes (static number for now) */}
  <div className="blog-likes">
    ❤️ 12
  </div>

  <a className="learn-more">
    Learn More <ArrowRight size={16} />
  </a>

  <span className="read-time">{blog.readTime || "4 min read"}</span>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}
