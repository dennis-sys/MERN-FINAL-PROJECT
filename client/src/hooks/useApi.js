import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useApi = () => {
  const { token } = useContext(AuthContext);

  const get = async (url) => {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  const post = async (url, data, isFormData = false) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  const put = async (url, data) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  const del = async (url) => {
    const res = await fetch(url, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  return { get, post, put, del };
};

