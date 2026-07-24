import { useContext, useState, useEffect } from "react";
import { PostContext } from "../context/PostContext";
import UploadDocument from "./UploadDocument";
import { useApi } from "../hooks/useApi";
import "./DocumentList.css";

export default function DocumentList() {
  const { posts: documents, fetchPosts: fetchDocuments } =
    useContext(PostContext);

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null); // id of the doc being deleted
  const api = useApi();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    setDeleting(id);
    try {
      await api.del(`/api/documents/${id}`);
      fetchDocuments();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="doc-list-wrapper">
      <UploadDocument
        docToEdit={editing}
        onSuccess={() => {
          fetchDocuments();
          setEditing(null);
        }}
      />

      <h2>All Documents</h2>
      {documents.length === 0 && <p>No documents yet.</p>}

      {documents.map((d) => {
        const rawUrl = (d.fileUrl || "").trim();
        // GridFS paths are relative (/api/files/:id). Prefix with the backend
        // base URL so they resolve correctly when the frontend is hosted
        // separately (e.g. Netlify) and not proxied to the backend.
        const apiBase = (import.meta.env.VITE_API_URL || "https://cdms-91w6.onrender.com").replace(/\/$/, "");
        const finalUrl = rawUrl.startsWith("/api/files/")
          ? `${apiBase}${rawUrl}`
          : rawUrl;

        return (
          <div key={d._id} className="doc-card">
            <h3>{d.title}</h3>
            <p>{d.description}</p>
            <p><strong>Department:</strong> {d.department}</p>
            <p><strong>Uploaded by:</strong> {d.uploadedBy?.email || "email"}</p>

            <div className="doc-actions">
              {/* Open in new tab */}
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-open"
              >
                ↗ Open
              </a>

              {/* Download */}
              <a
                href={finalUrl}
                download={d.filename}
                className="btn-download"
              >
                Download
              </a>

              {/* Edit */}
              <button className="btn-edit" onClick={() => setEditing(d)}>
                Edit
              </button>

              {/* Delete */}
              <button
                className="btn-delete"
                onClick={() => handleDelete(d._id)}
                disabled={deleting === d._id}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {deleting === d._id && <span className="btn-spinner" />}
                {deleting === d._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
