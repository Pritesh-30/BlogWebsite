import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case "paragraph":
      return (
        <p
          style={{
            lineHeight: "1.8",
            margin: "1rem 0",
            color: "#d0d0e0",
            fontSize: "1.15rem",
            fontWeight: "450",
          }}
        >
          {section.text}
        </p>
      );

    case "subtopic": {
      const Heading = `h${section.level || 2}`;
      return (
        <Heading
          style={{
            marginTop: "2rem",
            marginBottom: "0.8rem",
            color: "white",
            fontSize: section.level === 3 ? "1.4rem" : "1.6rem",
            fontWeight: "600",
          }}
        >
          {section.title}
        </Heading>
      );
    }

    case "bulletList":
      return (
        <ul
          style={{
            paddingLeft: "25px",
            margin: "1.5rem 0",
            color: "#d0d0e0",
          }}
        >
          {section.items.map((item, i) => (
            <li key={i} style={{ marginBottom: "0.5rem",fontSize: "1.1rem"}}>
              {item}
            </li>
          ))}
        </ul>
      );

    case "codeSnippet":
      return (
        <div style={{ margin: "1.8rem 0" }}>
          <SyntaxHighlighter
            language={section.language || "javascript"}
            style={atomDark}
            customStyle={{
              borderRadius: "10px",
              padding: "16px",
              fontSize: "0.95rem",
              overflowX: "auto",
              background: "#1e1e1e",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {section.code}
          </SyntaxHighlighter>
        </div>
      );

    case "image": {
      const imageSrc = section.previewUrl || section.url;
      if (!imageSrc) return null;

      return (
        <figure style={{ margin: "2rem 0", textAlign: "center" }}>
          <img
            src={imageSrc}
            alt={section.altText || "Uploaded Image"}
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
          {section.caption && (
            <figcaption style={{ color: "#aaa", marginTop: "5px", fontSize: "0.9em" }}>
              {section.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "youtubeEmbed":
      return (
        <div style={{ margin: "2rem 0", textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              borderRadius: "10px",
            }}
          >
            <iframe
              src={`${section.videoUrl}`}
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </div>
          {section.caption && (
            <p style={{ color: "#aaa", fontSize: "0.9rem", marginTop: "4px" }}>
              {section.caption}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
};

const SectionPreview = ({ data }) => {
  if (!data) return <div>Click “Show Preview” to render your blog.</div>;

  const tagsArray = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <article
      style={{
        backgroundColor: "#0f0f1f",
        color: "#d0d0e0",
        padding: "2rem",
        borderRadius: "12px",
        maxWidth: "850px",
        margin: "2rem auto",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* --- Thumbnail --- */}
      {data.thumbnailUrl && (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "10px",
            marginBottom: "1.2rem",
          }}
        >
          <img
            src={data.thumbnailUrl}
            alt="Thumbnail"
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

      {/* --- Tags (centered & bigger) --- */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
      >
        {tagsArray.map((tag) => (
          <span
            key={tag}
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
        {data.title}
      </h1>

      {/* --- Decorative dots (like BlogDetails) --- */}
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

      {/* --- Render dynamic sections --- */}
      {data.contentSections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </article>
  );
};

export default SectionPreview;
