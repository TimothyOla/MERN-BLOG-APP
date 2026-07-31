import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/posts", form);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-card wide">
          <h1>Write a new post</h1>
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                required
                value={form.content}
                onChange={handleChange}
              />
            </div>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
