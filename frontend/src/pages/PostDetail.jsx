import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete post");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="container page error-banner">{error}</div>;

  const isOwner = user && post.author?._id === user.id;
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page">
      <div className="container post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          {post.author?.name || "Unknown"} · {date}
        </div>
        <div className="post-body">{post.content}</div>

        {isOwner && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-outline">
              Edit
            </Link>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
