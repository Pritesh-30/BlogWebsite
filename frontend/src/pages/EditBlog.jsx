import React, { useEffect, useState } from "react";
import BlogCreator from "../components/BlogCreator";
import SectionPreview from "../components/SectionPreview";
import "../Styles/CreateBlog.css";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {servers} from "../environment";

const initialBlogState = {
  title: "",
  twoLineDescription: "",
  tags: "",
  thumbnailUrl: "",
  contentSections: [],
};

const EditBlog = () => {
  const { id } = useParams(); // ✅ get blog ID from route
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState(initialBlogState);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch blog by ID on load
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${servers}/api/blogs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();

        setBlogData({
          title: data.title || "",
          twoLineDescription: data.twoLineDescription || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
          thumbnailUrl: data.thumbnailUrl || "",
          contentSections: data.contentSections || [],
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleMetaDataChange = (name, value) => {
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionsChange = (newSections) => {
    setBlogData((prev) => ({ ...prev, contentSections: newSections }));
  };

  const handleShowPreview = () => {
    setPreviewData(blogData);
    setShowPreview(true);
  };

  const handleBackToEditor = () => {
    setShowPreview(false);
  };

  // ✅ Update instead of Create
  const handleUpdateBlog = async () => {
    if (!blogData.title || !blogData.twoLineDescription || blogData.contentSections.length === 0) {
      toast.error("Please fill in the title, description, and at least one content section.");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmitting(true);

    try {
      const response = await fetch(`${servers}/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...blogData,
          tags: blogData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          lastUpdated: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error(`Failed (${response.status})`);

      const updated = await response.json();
    //   console.log(updated)
    //   console.log(updated._id)
      toast.success("✅ Blog updated successfully!");
      setTimeout(() => navigate(`/blogs/${updated.blog._id}`), 1500);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("❌ Failed to update blog.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-text">Loading blog...</div>;

  return (
    <div className="create-blog-page-container">
      {/* LEFT PANEL */}
      <div className="control-panel">
        <div className="mode-toggle">
          <button
            className={`view-toggle-btn ${!showPreview ? "active" : ""}`}
            onClick={() => setShowPreview(false)}
          >
            📝 Editor
          </button>
          <button
            className={`view-toggle-btn ${showPreview ? "active" : ""}`}
            onClick={handleShowPreview}
          >
            👁️ Preview
          </button>
        </div>

        <hr />

        <button
          className={`publish-btn ${submitting ? "disabled" : ""}`}
          onClick={handleUpdateBlog}
          disabled={submitting}
        >
          {submitting ? "Updating..." : "💾 Save Changes"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="content-area">
        {!showPreview ? (
          <BlogCreator
            blogData={blogData}
            onMetaDataChange={handleMetaDataChange}
            onSectionsChange={handleSectionsChange}
          />
        ) : (
          <div className="section-preview-container">
            <button onClick={handleBackToEditor} className="add-section-btn">
              ← Back to Editor
            </button>
            <SectionPreview data={previewData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBlog;
