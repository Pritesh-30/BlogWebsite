import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id]);

  if (!blog)
    return (
      <p style={{ textAlign: "center", marginTop: "3rem", color: "#ccc" }}>
        Loading...
      </p>
    );

  return (
    <div
      style={{
         minWidth: "850px",
        maxWidth: "850px",
        margin: "3rem auto",
        padding: "2rem",
        lineHeight: "1.8",
        color: "#d0d0e0",
        backgroundColor: "#0f0f1f",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* --- Thumbnail --- */}
      {blog.thumbnailUrl && (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "10px",
            marginBottom: "1.2rem",
            maxHeight: "280px",
          }}
        >
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            style={{
              width: "100%",
              maxWidth: "650px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "12px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      )}

      {/* --- Tags (center & bigger) --- */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
      >
        {blog.tags?.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: "#6a9cfd",
              color: "white",
              padding: "6px 14px",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* --- Title (center & bold) --- */}
      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: "800",
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "1.2rem",
        }}
      >
        {blog.title}
      </h1>

      {/* --- Decorative 3 Dots / Squares --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "2rem",
        }}
      >
        <span style={{ width: "8px", height: "8px", background: "#6a9cfd", borderRadius: "50%" }}></span>
        <span style={{ width: "8px", height: "8px", background: "#6a9cfd", borderRadius: "50%" }}></span>
        <span style={{ width: "8px", height: "8px", background: "#6a9cfd", borderRadius: "50%" }}></span>
      </div>

      {/* --- Dynamic Blog Content Sections --- */}
      <div>
        {blog.contentSections?.map((section, index) => {
          switch (section.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  style={{
                    marginBottom: "1.2rem",
                    fontSize: "1.15rem",
                    color: "#d0d0e0",
                    fontWeight: "450",
                  }}
                >
                  {section.text}
                </p>
              );

            case "subtopic":
              return (
                <h3
                  key={index}
                  style={{
                    marginTop: "2rem",
                    marginBottom: "0.8rem",
                    fontSize: section.level === 3 ? "1.4rem" : "1.6rem",
                    color: "#ccc",
                    fontWeight: "600",
                  }}
                >
                  {section.title}
                </h3>
              );

            case "image":
              return (
                <div key={index} style={{ textAlign: "center", margin: "2rem 0" }}>
                  <img
                    src={section.url}
                    alt={section.altText || "blog image"}
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "auto",
                      maxHeight: "350px",
                      borderRadius: "12px",
                      objectFit: "contain",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </div>
              );

            case "youtubeEmbed":
              return (
                <div
                  key={index}
                  style={{
                    margin: "2rem 0",
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={`${section.videoUrl}`}
                    title="YouTube video"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  ></iframe>
                </div>
              );

            case "bulletList":
              return (
                <ul key={index} style={{ margin: "1.5rem 0 1.5rem 2rem", color: "#d0d0e0" }}>
                  {section.items?.map((item, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              );

            case "codeSnippet":
              return (
                <SyntaxHighlighter
            language={section.language || 'javascript'}
            style={atomDark}
            customStyle={{
              borderRadius: '10px',
              padding: '16px',
              fontSize: '0.95rem',
              overflowX: 'auto',
              overflowY: 'hidden',
              background: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
                  {section.code}
                </SyntaxHighlighter>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* --- Footer Thank You Section --- */}
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#fff" }}>Thanks for reading!!!</h2>
        <p style={{ fontSize: "1.1rem", marginTop: "0.3rem", color: "#a2a2ff" }}>
          ~ {blog.author?.username || "Anonymous"}
        </p>

        <br />

        {/* Comment section */}
        <textarea
          placeholder="What are your thoughts..?"
          style={{
            width: "85%",
            height: "130px",
            borderRadius: "12px",
            background: "#1b1b2e",
            border: "1px solid #333",
            color: "#ddd",
            padding: "1rem",
            resize: "none",
          }}
        ></textarea>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button
            style={{
              background: "#444",
              color: "white",
              border: "none",
              padding: "6px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              
            }}
          >
            Reset
          </button>

          <button
            style={{
              background: "#6a9cfd",
              color: "white",
              border: "none",
              padding: "6px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "60px"
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
