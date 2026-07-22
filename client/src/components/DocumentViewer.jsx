import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Must match the pdfjs-dist version bundled inside react-pdf (5.4.296), not the
// separately installed top-level package (5.4.394) which causes a version mismatch.
pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs";

// Derive file type from filename or URL
function getFileType(filename, url) {
  const name = (filename || url || "").toLowerCase();
  const ext = name.split(".").pop().split("?")[0];

  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "office";
  return "other";
}

// Microsoft Office Online Viewer — only works with public URLs
function OfficeViewer({ url, filename }) {
  const isLocal = url.startsWith("/");
  if (isLocal) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", background: "#1a1a2e", color: "#fff", gap: 16, padding: 32 }}>
        <span style={{ fontSize: 48 }}>📄</span>
        <p style={{ fontSize: 16, color: "#ccc", textAlign: "center" }}>
          Office documents ({filename}) can't be previewed inline.<br />Download the file to open it.
        </p>
        <a
          href={url}
          download={filename}
          style={{ ...navBtn, background: "#27ae60", textDecoration: "none", fontSize: 15, padding: "10px 24px" }}
        >
          ⬇ Download {filename}
        </a>
      </div>
    );
  }
  const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  return (
    <iframe
      src={src}
      title="Office Document Preview"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
}

// Google Docs Viewer — universal fallback
function GoogleDocsViewer({ url }) {
  const src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  return (
    <iframe
      src={src}
      title="Document Preview"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
}

// react-pdf renderer for PDFs
function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div style={{ color: "#fff", textAlign: "center", paddingTop: 40 }}>
        <p>⚠️ PDF render failed — trying Google Docs viewer…</p>
        <GoogleDocsViewer url={url} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
      <div style={{ flex: 1, overflow: "auto", width: "100%", display: "flex", justifyContent: "center", padding: 16, background: "#525659" }}>
        <Document
          file={{ url }}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1); }}
          onLoadError={(err) => { console.error("PDF error:", err); setError(err); }}
          loading={<div style={{ color: "#fff", paddingTop: 40 }}>Loading PDF…</div>}
        >
          <Page pageNumber={pageNumber} renderTextLayer renderAnnotationLayer />
        </Document>
      </div>
      {numPages && (
        <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "10px", background: "#16213e", width: "100%", justifyContent: "center", color: "#fff", fontSize: 14 }}>
          <button
            style={navBtn}
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
          >← Prev</button>
          <span>Page {pageNumber} of {numPages}</span>
          <button
            style={navBtn}
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
          >Next →</button>
        </div>
      )}
    </div>
  );
}

const navBtn = {
  padding: "6px 14px", borderRadius: 6, border: "none",
  cursor: "pointer", background: "#005bbb", color: "#fff", fontSize: 14,
};

// Image viewer
function ImageViewer({ url }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: 16, background: "#1a1a1a", overflow: "auto" }}>
      <img
        src={url}
        alt="Document preview"
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4 }}
      />
    </div>
  );
}

export default function DocumentViewer({ fileUrl, filename, onClose }) {
  if (!fileUrl) return null;

  const type = getFileType(filename, fileUrl);

  const renderContent = () => {
    switch (type) {
      case "image":  return <ImageViewer url={fileUrl} />;
      case "pdf":    return <PdfViewer url={fileUrl} />;
      case "office": return <OfficeViewer url={fileUrl} />;
      default:       return <GoogleDocsViewer url={fileUrl} />;
    }
  };

  const typeLabel = {
    image: "Image Preview",
    pdf: "PDF Preview",
    office: "Document Preview",
    other: "Document Preview",
  }[type];

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.75)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "88%", height: "92%",
          background: "#1a1a2e", borderRadius: 10,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 16px", background: "#16213e",
          borderBottom: "1px solid #333", flexShrink: 0,
        }}>
          <div>
            <span style={{ color: "#fff", fontWeight: 600 }}>{typeLabel}</span>
            {filename && (
              <span style={{ color: "#aaa", fontSize: 13, marginLeft: 10 }}>{filename}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...navBtn, background: "#27ae60", textDecoration: "none", fontSize: 13 }}
            >
              ↗ Open
            </a>
            <button onClick={onClose} style={{ ...navBtn, background: "#c0392b" }}>
              ✖ Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
