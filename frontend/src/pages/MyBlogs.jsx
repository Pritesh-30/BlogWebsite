import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import "../Styles/MyBlogs.css";
import {servers} from "../environment";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await fetch(`${servers}/api/blogs/myblogs`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error("Failed to fetch your blogs");

        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching your blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [token]);

  const handleEdit = (id) => navigate(`/blogs/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`${servers}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      alert("🗑️ Blog deleted successfully!");
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("❌ Failed to delete blog");
    }
  };

  if (loading) return <div className="loading-text">Loading your blogs...</div>;

  return (
    <div className="blog-page">
      {/* 🌐 Header */}
      <div className="blog-header">
        <h1 className="site-name">
          <span className="code-text">MY</span>{" "}
          <span className="unscripted-text">BLOGS</span>
        </h1>
        <p className="site-tagline">Manage your blogs easily ✨</p>
      </div>

      {/* 🧱 Blog Cards */}
      <div className="blog-list-container">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              {/* ✅ Thumbnail */}
              {blog.thumbnailUrl && (
                <div
                  className="thumbnail-container"
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                >
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="thumbnail-img"
                  />
                </div>
              )}

              {/* 🏷️ Tags */}
              <div className="blog-tags">
                {(blog.tags && blog.tags.length > 0
                  ? blog.tags
                  : ["General"]
                )
                  .slice(0, 3)
                  .map((tag, index) => (
                    <span key={index} className="blog-tag">
                      {tag}
                    </span>
                  ))}
              </div>

              {/* 📝 Title */}
              <h3
                className="blog-title"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                {blog.title}
              </h3>

              {/* 📄 Description */}
              <p className="blog-description">{blog.twoLineDescription}</p>

              {/* ⚙️ Footer */}
              <div className="blog-footer">
                {/* ✅ Left: Edit & Delete */}
                <div className="button-group">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(blog._id);
                    }}
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(blog._id);
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>

                {/* ✅ Right: Read time */}
                <span className="read-time">
                  {blog.readTime || "4 min read"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-blogs-text">You haven’t published any blogs yet 📝</p>
        )}
      </div>
    </div>
  );
}
