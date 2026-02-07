const express = require('express');
const {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost
} = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public + Auth
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Auth only
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
