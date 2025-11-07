import Comment from "../models/Comment.js";

export const getBlogComments = async (req, res) => {
  try {
    const { username, content, parentComment } = req.body;

    const newComment = new Comment({
      blog: req.params.blogId,
      username,
      content,
      parentComment: parentComment || null,
    });

    await newComment.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
      // console.log(comments); // optional
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

