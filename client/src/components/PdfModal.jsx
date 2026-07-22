import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfModal({ fileUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  if (!fileUrl) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const modalStyle = {
    width: "85%",
    height: "90%",
    background: "#1a1a2e",
    borderRadius: 10,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "#16213e",
    borderBottom: "1px solid #333",
    flexShrink: 0,
  };

  const bodyStyle = {
    flex: 1,
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "16px",
    background: "#525659",
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: "10px",
    background: "#16213e",
    borderTop: "1px solid #333",
    flexShrink: 0,
    color: "#fff",
    fontSize: 14,
  };

  const btnStyle = {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#005bbb",
    color: "#fff",
    fontSize: 14,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <span style={{ color: "#fff", fontWeight: 600 }}>PDF Preview</span>
          <button
            onClick={onClose}
            style={{ ...btnStyle, background: "#c0392b" }}
          >
            ✖ Close
          </button>
        </div>

        {/* PDF content */}
        <div style={bodyStyle}>
          {error ? (
            <div style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
              <p>⚠️ Could not load PDF.</p>
              <p style={{ fontSize: 13, color: "#aaa" }}>{error.message}</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4fc3f7", marginTop: 12, display: "inline-block" }}
              >
                Open in new tab instead →
              </a>
            </div>
          ) : (
            <Document
              file={{ url: fileUrl }}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setPageNumber(1);
              }}
              onLoadError={(err) => {
                console.error("PDF load error:", err);
                setError(err);
              }}
              loading={
                <div style={{ color: "#fff", marginTop: 40 }}>Loading PDF…</div>
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          )}
        </div>

        {/* Footer navigation */}
        {numPages && !error && (
          <div style={footerStyle}>
            <button
              style={{ ...btnStyle, opacity: pageNumber <= 1 ? 0.4 : 1 }}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
            >
              ← Prev
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              style={{ ...btnStyle, opacity: pageNumber >= numPages ? 0.4 : 1 }}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
