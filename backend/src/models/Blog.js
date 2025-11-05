import mongoose from "mongoose";

const contentSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["paragraph", "subtopic", "image", "youtubeEmbed", "bulletList", "codeSnippet"],
    required: true,
  },
  text: String, // for paragraph
  title: String, // for subtopic
  level: Number, // for subtopic (like h2, h3)
  url: String, // for image
  caption: String, // for image / youtube caption
  altText: String, // for image
  previewUrl: String, // for image (optional local preview)
  videoUrl: String, // for youtubeEmbed
  items: [String], // for bulletList
  language: String, // for codeSnippet
  code: String, // for codeSnippet
}, { _id: false });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [String],
  twoLineDescription: { type: String },
  thumbnailUrl: { type: String },

  // array of content sections (paragraphs, images, etc.)
  contentSections: [contentSectionSchema],

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["PENDING", "APPROVED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blog", blogSchema);
