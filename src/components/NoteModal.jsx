import React from "react";

const NoteModal = ({ open, onClose, date, text, onDelete }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "90%",
          width: "400px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>📅 {date}</h3>
        <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{text}</p>

        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              marginTop: 20,
              padding: "10px 16px",
              background: "#e11d48",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Delete Note
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            padding: "10px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            width: "100%",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NoteModal;
