import React from 'react';
import '../Styles/SectionForm.css';

const SectionForm = ({ section, updateSection, removeSection }) => {
  const handleListChange = (index, value) => {
    const updated = [...section.items];
    updated[index] = value;
    updateSection(section.id, 'items', updated);
  };

  const addListItem = () =>
    updateSection(section.id, 'items', [...section.items, '']);
  const removeListItem = (index) =>
    updateSection(
      section.id,
      'items',
      section.items.filter((_, i) => i !== index)
    );

  const handleUpdate = (field, value) =>
    updateSection(section.id, field, value);

  let inputs;

  switch (section.type) {
    case "paragraph":
      inputs = (
        <textarea
          placeholder="Paragraph text..."
          rows="4"
          value={section.text}
          onChange={(e) => handleUpdate("text", e.target.value)}
          className="sf-textarea"
        />
      );
      break;

    case "subtopic":
      inputs = (
        <>
          <input
            type="text"
            placeholder="Subtopic Title"
            value={section.title}
            onChange={(e) => handleUpdate("title", e.target.value)}
            className="sf-input"
          />
          <select
            value={section.level}
            onChange={(e) => handleUpdate("level", parseInt(e.target.value))}
            className="sf-input"
          >
            <option value={2}>📘 Large Heading (Main Topic)</option>
            <option value={3}>📗 Medium Heading (Subtopic)</option>
          </select>
        </>
      );
      break;

    case "bulletList":
      inputs = (
        <div className="sf-list-section">
          <h4>Bullet List</h4>
          {section.items.map((item, index) => (
            <div className="sf-list-item" key={index}>
              <input
                type="text"
                placeholder={`Bullet ${index + 1}`}
                value={item}
                onChange={(e) => handleListChange(index, e.target.value)}
                className="sf-input"
              />
              <button
                type="button"
                className="sf-btn-delete"
                onClick={() => removeListItem(index)}
              >
                🗑️
              </button>
            </div>
          ))}
          <button type="button" className="sf-btn-add" onClick={addListItem}>
            + Add Bullet
          </button>
        </div>
      );
      break;

    case "codeSnippet":
      inputs = (
        <div className="sf-code-section">
          <h4>Code Snippet</h4>
          <select
            value={section.language}
            onChange={(e) => handleUpdate("language", e.target.value)}
            className="sf-input"
          >
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="python">Python</option>
          </select>
          <textarea
            placeholder="Write your code here..."
            value={section.code}
            onChange={(e) => handleUpdate("code", e.target.value)}
            className="sf-textarea sf-code"
          />
        </div>
      );
      break;

    case "image":
      inputs = (
        <div className="sf-image-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const localPreview = URL.createObjectURL(file);
              handleUpdate("previewUrl", localPreview);
              handleUpdate("url", localPreview);
            }}
            className="sf-input"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={section.url}
            onChange={(e) => handleUpdate("url", e.target.value)}
            className="sf-input"
          />

          <input
            type="text"
            placeholder="Caption"
            value={section.caption}
            onChange={(e) => handleUpdate("caption", e.target.value)}
            className="sf-input"
          />

          <input
            type="text"
            placeholder="Alt Text"
            value={section.altText}
            onChange={(e) => handleUpdate("altText", e.target.value)}
            className="sf-input"
          />

          {/* {(section.previewUrl || section.url) && (
            <div className="sf-image-preview">
              <img
                src={section.previewUrl || section.url}
                alt={section.altText || 'Preview'}
              />
            </div>
          )} */}
        </div>
      );
      break;

    case "youtubeEmbed":
      inputs = (
        <>
          <input
            type="text"
            placeholder="Enter YouTube video link"
            value={section.videoUrl}
            onChange={(e) => {
              let url = e.target.value;
              // ✅ Automatically convert watch link to embed
              if (url.includes("watch?v=")) {
                url = url.replace("watch?v=", "embed/");
              }
              // ✅ Handle short links (youtu.be)
              if (url.includes("youtu.be/")) {
                const id = url.split("youtu.be/")[1].split("?")[0];
                url = `https://www.youtube.com/embed/${id}`;
              }
              handleUpdate("videoUrl", url);
            }}
            className="sf-input"
          />

          <input
            type="text"
            placeholder="Caption"
            value={section.caption}
            onChange={(e) => handleUpdate("caption", e.target.value)}
            className="sf-input"
          />
        </>
      );
      break;

    default:
      inputs = <p>Unsupported section type</p>;
  }

  return (
    <div className="section-form-wrapper">
      <div className="sf-header">
        <strong>{section.type.toUpperCase()}</strong>
        <button
          type="button"
          className="sf-btn-remove"
          onClick={() => removeSection(section.id)}
        >
          ✖
        </button>
      </div>
      {inputs}
    </div>
  );
};

export default SectionForm;
