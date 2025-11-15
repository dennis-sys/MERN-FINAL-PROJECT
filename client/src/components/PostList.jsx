import { useContext, useState } from "react";
import { PostContext } from "../context/PostContext";
import PostForm from "./PostForm";
import { useApi } from "../hooks/useApi";

export default function PostList() {
  const { posts, fetchPosts } = useContext(PostContext);
  const [editingPost, setEditingPost] = useState(null);
  const api = useApi();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await api.del(`/api/posts/${id}`);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ padding: 20 }}>
      <PostForm postToEdit={editingPost} onSuccess={() => { fetchPosts(); setEditingPost(null); }} />

      <h2>All Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map(p => (
        <div key={p._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          {p.category && <p><strong>Category:</strong> {p.category.name}</p>}
          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)} style={{ marginLeft: 10 }}>Delete</button>
        </div>
      ))}
    </div>
  );
}
