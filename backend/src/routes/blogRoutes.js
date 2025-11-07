import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  getPendingBlogs,
  verifyBlog,
  editBlog,
  getUserBlogs
} from "../controllers/blogController.js";
import { protect, adminOnly, isLoggedIn } from "../middleware/authMiddleware.js";
import { get } from "mongoose";

const router = express.Router();
// Get all approved blogs
router.get("/", getAllBlogs);

// Create a new blog
router.post("/", protect, isLoggedIn, createBlog);

/* ✅ Must come before `/:id` */
router.get("/myblogs", protect, getUserBlogs);

/* Admin Routes */
router.get("/admin/pending", protect, adminOnly, getPendingBlogs);
router.patch("/admin/:id/verify", protect, adminOnly, verifyBlog);

/* Edit or View Blog by ID (comes last) */
router.put("/:id", protect, isLoggedIn, editBlog);
router.get("/:id", getBlogById);

export default router;