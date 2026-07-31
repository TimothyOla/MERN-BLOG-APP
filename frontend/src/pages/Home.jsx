import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostCard from "../components/PostCard.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (err) {
        setError("Could not load posts. Is the API running?");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Latest posts</h1>
          <p>Notes, essays, and things worth writing down.</p>
        </div>

        {loading && <div className="loading">Loading posts...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            No posts yet. Be the first to write one.
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
