import Blog from "../models/Blog.js";

export const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "APPROVED" });
  res.json(blogs);
};

export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id)
      .populate("author", "username");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

export const createBlog = async (req, res) => {
  try {
    const { 
      title, 
      twoLineDescription, 
      thumbnailUrl, 
      tags, 
      contentSections 
    } = req.body;
    const author = req.user._id;

    const status = "APPROVED";

    // Ensure tags are stored as array
    const formattedTags = Array.isArray(tags)
      ? tags
      : tags
      ? tags.split(",").map(tag => tag.trim())
      : [];

    const blog = await Blog.create({
      title,
      twoLineDescription,
      thumbnailUrl,
      tags: formattedTags,
      contentSections,
      author,
      status,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Error creating blog" });
  }
};



export const getPendingBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "PENDING" });
  res.json(blogs);
};

export const verifyBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });
  blog.status = "APPROVED";
  await blog.save();
  res.json({ message: "Blog approved" });
};
