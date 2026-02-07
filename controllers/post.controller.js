const Post = require('../models/Post');
const generateSlug = require('../utils/slugify');

/**
 * CREATE POST
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = generateSlug(title);

    const existingSlug = await Post.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: 'Post with same title already exists' });
    }

    const post = await Post.create({
      title,
      slug,
      content,
      tags,
      status,
      author: req.user._id
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * GET POSTS (PUBLIC + AUTH FILTERING)
 */
const getPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tag,
      author,
      status
    } = req.query;

    const query = { deletedAt: null };

    // Public users: only published
    if (!req.user) {
      query.status = 'published';
    }

    // Auth users filtering by status
    if (req.user && status) {
      if (status === 'draft') {
        query.status = 'draft';
        query.author = req.user._id;
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * GET SINGLE PUBLISHED POST
 */
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: 'published',
      deletedAt: null
    }).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE POST (AUTHOR ONLY)
 */
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.deletedAt) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE POST (SOFT DELETE)
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.deletedAt) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.deletedAt = new Date();
    await post.save();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost
};
