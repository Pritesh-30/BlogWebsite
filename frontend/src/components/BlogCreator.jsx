
import React, { useState } from "react";
import SectionForm from "./SectionForm";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../Styles/BlogCreator.css"; // ✅ NEW CSS FILE

// --- Thumbnail presets based on tags ---
const thumbnailMap = {
  react: "https://yourcdn.com/thumbnails/react.jpg",
  next: "https://yourcdn.com/thumbnails/next.jpg",
  javascript: "https://yourcdn.com/thumbnails/javascript.jpg",
  python: "https://yourcdn.com/thumbnails/python.jpg",
  java: "https://yourcdn.com/thumbnails/java.jpg",
};

const defaultThumbnail = "https://yourcdn.com/thumbnails/default.jpg";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const BlogCreator = ({ blogData, onMetaDataChange, onSectionsChange }) => {
  const [newSectionType, setNewSectionType] = useState("paragraph");
  const [localThumbnailPreview, setLocalThumbnailPreview] = useState(null);

  const addSection = () => {
    const id = Date.now();
    let section;
    switch (newSectionType) {
      case "subtopic":
        section = { id, type: "subtopic", title: "", level: 2 };
        break;
      case "image":
        section = { id, type: "image", url: "", caption: "", altText: "", previewUrl: "" };
        break;
      case "youtubeEmbed":
        section = { id, type: "youtubeEmbed",videoUrl: "", caption: "" };
        break;
      case "bulletList":
        section = { id, type: "bulletList", items: [""] };
        break;
      case "codeSnippet":
        section = { id, type: "codeSnippet", language: "javascript", code: "" };
        break;
      default:
        section = { id, type: "paragraph", text: "" };
    }
    onSectionsChange([...blogData.contentSections, section]);
  };

  const updateSection = (id, field, value) => {
    const updated = blogData.contentSections.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    onSectionsChange(updated);
  };

  const removeSection = (id) => {
    const filtered = blogData.contentSections.filter((s) => s.id !== id);
    onSectionsChange(filtered);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = reorder(blogData.contentSections, result.source.index, result.destination.index);
    onSectionsChange(items);
  };

  const handleLocalThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setLocalThumbnailPreview(localUrl);
      onMetaDataChange("thumbnailUrl", localUrl);
    }
  };

  const handleAutoThumbnail = () => {
    const tagsArray = (blogData.tags || "")
      .split(",")
      .map((t) => t.trim().toLowerCase());
    let selected = defaultThumbnail;
    for (let tag of tagsArray) {
      if (thumbnailMap[tag]) {
        selected = thumbnailMap[tag];
        break;
      }
    }
    onMetaDataChange("thumbnailUrl", selected);
    setLocalThumbnailPreview(selected);
  };

  return (
    <div className="blog-creator-container">
      <h2 className="blog-creator-title">📝 Blog Details</h2>

      <div className="blog-meta">
        <input
          type="text"
          placeholder="Main Topic Name (Title)"
          value={blogData.title}
          onChange={(e) => onMetaDataChange("title", e.target.value)}
          className="bc-input"
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={blogData.tags}
          onChange={(e) => onMetaDataChange("tags", e.target.value)}
          className="bc-input"
        />

        <textarea
          placeholder="2-Line Description"
          value={blogData.twoLineDescription}
          onChange={(e) =>
            onMetaDataChange("twoLineDescription", e.target.value)
          }
          rows="2"
          className="bc-textarea"
        />
      </div>

      {/* Thumbnail Section */}
      <div className="bc-thumbnail-section">
        <h4>Thumbnail</h4>
        <div className="bc-thumbnail-controls">
          <input type="file" accept="image/*" onChange={handleLocalThumbnail} />
          <input
            type="text"
            placeholder="Paste thumbnail URL"
            value={blogData.thumbnailUrl}
            onChange={(e) => {
              onMetaDataChange("thumbnailUrl", e.target.value);
              setLocalThumbnailPreview(e.target.value);
            }}
            className="bc-input"
          />
          <button onClick={handleAutoThumbnail} className="bc-btn-primary">
            Auto Select
          </button>
        </div>
        {/* {(localThumbnailPreview || blogData.thumbnailUrl) && (
          <div className="bc-thumbnail-preview">
            <img
              src={localThumbnailPreview || blogData.thumbnailUrl}
              alt="Thumbnail Preview"
            />
          </div>
        )} */}
      </div>

      <hr className="bc-divider" />

      {/* Dynamic Sections */}
      <h3>📚 Dynamic Content (Drag to reorder)</h3>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              className="bc-section-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {blogData.contentSections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={String(section.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`bc-section-item ${
                        snapshot.isDragging ? "dragging" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,

                        // width: "100%", // ✅ keep drag positioning                       // ✅ prevents expansion
                      }}
                    >
                      <SectionForm
                        section={section}
                        updateSection={updateSection}
                        removeSection={removeSection}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Section */}
      <div className="bc-add-section">
        <select
          value={newSectionType}
          onChange={(e) => setNewSectionType(e.target.value)}
          className="bc-select"
        >
          <option value="paragraph">Paragraph</option>
          <option value="subtopic">Subtopic</option>
          <option value="image">Image</option>
          <option value="youtubeEmbed">YouTube Link</option>
          <option value="bulletList">Bullet List</option>
          <option value="codeSnippet">Code Snippet</option>
        </select>
        <button onClick={addSection} className="bc-btn-success">
          + Add Section
        </button>
      </div>
    </div>
  );
};

export default BlogCreator;
