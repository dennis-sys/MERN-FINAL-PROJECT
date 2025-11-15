import { createContext, useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const api = useApi();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const data = await api.get("/api/posts");
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, fetchPosts }}>
      {children}
    </PostContext.Provider>
  );
};
