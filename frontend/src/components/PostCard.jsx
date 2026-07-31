import { Link } from "react-router-dom";

const excerpt = (text, len = 160) =>
  text.length > len ? text.slice(0, len).trim() + "…" : text;

const PostCard = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="post-card">
      <h2>
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h2>
      <div className="post-meta">
        {post.author?.name || "Unknown"} · {date}
      </div>
      <p className="post-excerpt">{excerpt(post.content)}</p>
    </article>
  );
};

export default PostCard;
