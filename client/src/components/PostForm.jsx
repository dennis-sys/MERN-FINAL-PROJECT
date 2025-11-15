import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

export default function PostForm({ postToEdit, onSuccess }) {
  const api = useApi();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    api.get("/api/categories")
      .then(data => {
        console.log("Categories loaded:", data);
        setCategories(data);
      })
      .catch(err => console.error(err));
  }, []);

  // If editing, populate form
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setCategory(postToEdit.category?._id || "");
    }
  }, [postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (postToEdit) {
        await api.put(`/api/posts/${postToEdit._id}`, { title, content, category });
      } else {
        await api.post("/api/posts", { title, content, category });
      }
      onSuccess(); // Refresh posts in parent
      setTitle("");
      setContent("");
      setCategory("");
    } catch (err) {
      console.error(err);
      setError("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, border: "1px solid #ccc", marginBottom: 20 }}>
      <h2>{postToEdit ? "Edit Post" : "Create Post"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
}
