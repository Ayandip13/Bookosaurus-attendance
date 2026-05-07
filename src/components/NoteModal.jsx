import React from "react";
import { useTheme } from "../ThemeContext";

const NoteModal = ({ open, onClose, date, text, onDelete }) => {
  const { theme } = useTheme();

  if (!open) return null;

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    const yy = y.slice(-2);
    return `${d}/${m}/${yy}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.modalBg,
          padding: "24px",
          borderRadius: "14px",
          maxWidth: "90%",
          width: "400px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowLg,
          color: theme.textPrimary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: theme.textPrimary, marginBottom: 4 }}>
          📅 {formatDate(date)}
        </h3>
        <p
          style={{
            marginTop: 12,
            whiteSpace: "pre-wrap",
            color: theme.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {text}
        </p>

        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              marginTop: 20,
              padding: "10px 16px",
              background: theme.danger,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              width: "100%",
              transition: "all 0.25s ease",
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
            background: theme.primary,
            color: theme.textOnPrimary,
            border: "none",
            borderRadius: "8px",
            width: "100%",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.25s ease",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NoteModal;
