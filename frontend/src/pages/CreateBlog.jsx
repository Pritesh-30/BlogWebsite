
import React, { useState } from 'react';
import BlogCreator from '../components/BlogCreator';
import SectionPreview from '../components/SectionPreview';
import '../Styles/CreateBlog.css';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


 // ✅ Keep this

const initialBlogState = {
  title: '',
  twoLineDescription: '',
  tags: '',
  thumbnailUrl: '',
  contentSections: [],
};

const CreateBlog = () => {
  const [blogData, setBlogData] = useState(initialBlogState);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleSaveDraft = () => {
    const finalData = {
      ...blogData,
      tags: (blogData.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      dateCreated: new Date().toISOString(),
      id: `blog-${Date.now()}`,
    };
    console.log('💾 Draft saved:', finalData);
    alert('Draft saved! Check console.');
  };
const handlePublishBlog = async () => {
  if (!blogData.title || !blogData.twoLineDescription || blogData.contentSections.length === 0) {
    alert("Please fill in the title, description, and at least one content section.");
    return;
  }
  const uploadToCloudinary = async (file) => {
//   console.log("Cloudinary URL:", process.env.REACT_APP_CLOUDINARY_URL);
// console.log("Upload Preset:", process.env.REACT_APP_BLOG_UPLOAD_PRESET);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.REACT_APP_BLOG_UPLOAD_PRESET); // 🔹 your unsigned preset
  const res = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url; // ✅ Cloudinary hosted image URL
};


  setSubmitting(true);
  const token = localStorage.getItem("token");

  try {
    let uploadedThumbnailUrl = blogData.thumbnailUrl;

    // ✅ Upload thumbnail (if it's a local blob URL)
    if (uploadedThumbnailUrl && uploadedThumbnailUrl.startsWith("blob:")) {
      const blob = await fetch(uploadedThumbnailUrl).then((r) => r.blob());
      uploadedThumbnailUrl = await uploadToCloudinary(blob);
    }

    // ✅ Upload section images (if they use local blob URLs)
    const updatedSections = await Promise.all(
      blogData.contentSections.map(async (section) => {
        if (section.type === "image" && section.url && section.url.startsWith("blob:")) {
          const blob = await fetch(section.url).then((r) => r.blob());
          const uploadedUrl = await uploadToCloudinary(blob);
          return { ...section, url: uploadedUrl, previewUrl: uploadedUrl };
        }
        return section;
      })
    );

    const finalData = {
      ...blogData,
      thumbnailUrl: uploadedThumbnailUrl,
      contentSections: updatedSections,
      dateCreated: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:5000/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(finalData),
    });

    if (!response.ok) throw new Error(`Failed (${response.status})`);

    const data = await response.json();
   toast.success('🎉 Blog published successfully! Redirecting...', { duration: 1500 });

      // ✅ Redirect to blog page after 2 seconds
      setTimeout(() => {
        navigate(`/blogs/${data._id}`);
      }, 3000);
    console.log("Saved Blog:", data);
    setBlogData(initialBlogState);
  } catch (error) {
    console.error("Error during publish:", error);
    alert("❌ Failed to publish blog. Check console for details.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="create-blog-page-container">
      {/* LEFT PANEL */}
      <div className="control-panel">
        <div className="mode-toggle">
          <button
            className={`view-toggle-btn ${!showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(false)}
          >
            📝 Editor
          </button>
          <button
            className={`view-toggle-btn ${showPreview ? 'active' : ''}`}
            onClick={handleShowPreview}
          >
            👁️ Preview
          </button>
        </div>

        <hr />


        <button
          className={`publish-btn ${submitting ? 'disabled' : ''}`}
          onClick={handlePublishBlog}
          disabled={submitting}
        >
          {submitting ? 'Publishing...' : '🚀 Publish Blog'}
        </button>

        <button className="save-draft-btn" onClick={handleSaveDraft}>
          💾 Save Draft (JSON)
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

export default CreateBlog;

