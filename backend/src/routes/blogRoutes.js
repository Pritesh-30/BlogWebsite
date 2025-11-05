import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  getPendingBlogs,
  verifyBlog
} from "../controllers/blogController.js";
import { protect, adminOnly, isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   📂 PUBLIC ROUTES
=========================== */

// Get all approved blogs
router.get("/", getAllBlogs);

// Get a single blog by ID (must come after admin routes)
router.get("/:id", getBlogById);


// Create a new blog (user must be logged in)
router.post("/", protect, isLoggedIn, createBlog);

// Get all pending blogs (admin only)
router.get("/admin/pending", protect, adminOnly, getPendingBlogs);

// Approve (verify) a pending blog (admin only)
router.patch("/admin/:id/verify", protect, adminOnly, verifyBlog);

export default router;
