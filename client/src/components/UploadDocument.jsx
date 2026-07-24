import { useState, useEffect, useContext } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import "./UploadDocument.css";

const departments = [
  "Registration and Coordination",
  "HR and Administration",
  "Supply Chain Management",
  "ICT and Compliance",
  "Finance and Accounts",
  "Legal",
  "CEO's Research and Policy"
];

export default function UploadDocument({ docToEdit, onSuccess }) {
  const api = useApi();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState(user?.department || "");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (docToEdit) {
      setTitle(docToEdit.title);
      setDescription(docToEdit.description || "");
      setDepartment(docToEdit.department);
    }
  }, [docToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !department || (!file && !docToEdit)) {
      setError("Title, department and file (for new document) are required");
      return;
    }
    setError("");

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("department", department);
      if (file) form.append("file", file);

      await api.post("/api/documents", form, true);
      onSuccess();
      setTitle("");
      setDescription("");
      setDepartment(user?.department || "");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h2>{docToEdit ? "Edit Document" : "Upload Document"}</h2>
      {error && <p style={{ color: "red", margin: "0 0 8px" }}>{error}</p>}

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <select value={department} onChange={e => setDepartment(e.target.value)}>
        <option value="">Select Department</option>
        {departments.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <input
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg,.txt,.csv"
        onChange={e => setFile(e.target.files[0])}
      />

      <button type="submit">Save Document</button>
    </form>
  );
}
