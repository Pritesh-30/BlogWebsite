import express from "express";
import { getBlogComments,getCommentsByBlog } from "../controllers/commentController.js";

const router = express.Router();

// 🟢 Add comment
router.post("/:blogId", getBlogComments);
// 🟡 Get comments for a specific blog
router.get("/:blogId", getCommentsByBlog);

// 🔴 Delete comment (optional for admin)
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
