import { useContext, useState, useEffect } from "react";
import { PostContext } from "../context/PostContext";
import UploadDocument from "./UploadDocument";
import { useApi } from "../hooks/useApi";
import DocumentViewer from "./DocumentViewer";

export default function DocumentList() {
  const { posts: documents, fetchPosts: fetchDocuments } =
    useContext(PostContext);

  const [editing, setEditing] = useState(null);

  // Document viewer state
  const [preview, setPreview] = useState(null); // { url, filename }

  const api = useApi();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    await api.del(`/api/documents/${id}`);
    fetchDocuments();
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
        // 🔥 Completely sanitize fileUrl
        const cleanUrl = (d.fileUrl || "").trim();

        // 🔥 Always Cloudinary full URL — never prefix backend or Netlify
        const finalUrl = cleanUrl;

        return (
          <div
            key={d._id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 12,
              borderRadius: 8,
              background: "var(--card-bg)",
            }}
          >
            <h3>{d.title}</h3>
            <p>{d.description}</p>
            <p>
              <strong>Department:</strong> {d.department}
            </p>
            <p>
              <strong>Uploaded by:</strong> {d.uploadedBy?.email || "email"}
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
              {/* Preview */}
              <button
                onClick={() => setPreview({ url: finalUrl, filename: d.filename })}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  background: "#005bbb",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Preview
              </button>

              {/* Download */}
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  background: "#222",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Download
              </a>

              {/* Edit */}
              <button
                onClick={() => setEditing(d)}
                style={{ padding: "6px 14px" }}
              >
                Edit
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(d._id)}
                style={{
                  padding: "6px 14px",
                  color: "white",
                  background: "red",
                  borderRadius: 6,
                  border: "none",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      <DocumentViewer
        fileUrl={preview?.url}
        filename={preview?.filename}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
