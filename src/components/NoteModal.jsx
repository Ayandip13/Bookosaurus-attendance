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
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.modalBg,
          padding: "28px",
          borderRadius: "18px",
          maxWidth: "90%",
          width: "420px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowLg,
          color: theme.textPrimary,
          position: "relative",
          overflow: "hidden",
          animation: "fadeInUp 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* gradient accent top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3,
          background: "linear-gradient(90deg, #4a88c2, #60a5fa, #93c5fd)",
          borderRadius: "18px 18px 0 0",
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: 4 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 10,
            background: theme.primaryGhost,
            border: `1px solid ${theme.border}`,
            fontSize: 17,
          }}>📅</div>
          <div>
            <h3 style={{ color: theme.textPrimary, fontSize: 16, margin: 0 }}>Note — {formatDate(date)}</h3>
            <p style={{ color: theme.textMuted, fontSize: 12, margin: 0, marginTop: 2 }}>Saved daily summary</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: theme.border, marginBottom: 14 }} />

        {/* Note text */}
        <p
          style={{
            whiteSpace: "pre-wrap",
            color: theme.textSecondary,
            lineHeight: 1.7,
            fontSize: 14,
            padding: "12px 14px",
            background: theme.cardBgAlt,
            borderRadius: 10,
            border: `1px solid ${theme.borderLight}`,
            minHeight: 60,
          }}
        >
          {text}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13.5,
                boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
              }}
            >
              Delete Note
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "linear-gradient(135deg, #4a88c2, #5b9bd5)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13.5,
              boxShadow: "0 4px 12px rgba(91,155,213,0.28)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
