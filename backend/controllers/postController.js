import Post from "../models/Post.js";

// @route GET /api/posts
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/posts/:id
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/posts (protected)
export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });
    const populated = await post.populate("author", "name email");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/posts/:id (protected, owner only)
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    const { title, content } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    await post.save();
    const populated = await post.populate("author", "name email");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/posts/:id (protected, owner only)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};
