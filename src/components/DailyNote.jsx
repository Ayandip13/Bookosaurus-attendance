import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useTheme } from "../ThemeContext";

const DailyNote = () => {
  const { theme } = useTheme();
  const today = new Date().toISOString().split("T")[0];
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      const ref = doc(db, "notes", today);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setText(snap.data().text || "");
      }
    };
    loadNote();
  }, [today]);

  const saveNote = async () => {
    const ref = doc(db, "notes", today);
    await setDoc(ref, { text, updatedAt: serverTimestamp() });
    setSaved(true);
    setText("");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div
      style={{
        marginTop: 28,
        marginBottom: 12,
        padding: "24px 28px",
        background: theme.noteCardBg,
        borderRadius: 16,
        border: `1px solid ${theme.noteCardBorder}`,
        boxShadow: theme.shadow,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle accent line at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3,
        background: "linear-gradient(90deg, #5b9bd5, #60a5fa, #93c5fd)",
        borderRadius: "16px 16px 0 0",
      }} />

      <h3
        style={{
          marginBottom: 14,
          color: theme.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 15,
        }}
      >
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 9,
          background: theme.primaryGhost,
          border: `1px solid ${theme.border}`,
          fontSize: 15,
        }}>📝</span>
        Today's Summary
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write today's notes, highlights, or blockers..."
        rows={4}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "12px",
          fontSize: "14px",
          lineHeight: 1.65,
          border: `1.5px solid ${theme.textareaBorder}`,
          background: theme.textareaBg,
          color: theme.textPrimary,
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "-0.01em",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.primary;
          e.target.style.boxShadow = `0 0 0 3px ${theme.primaryGhost}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.textareaBorder;
          e.target.style.boxShadow = "none";
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
        <button
          onClick={saveNote}
          style={{
            padding: "10px 22px",
            background: "linear-gradient(135deg, #4a88c2, #5b9bd5)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13.5,
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 14px rgba(91,155,213,0.30)",
          }}
        >
          Save Summary
        </button>

        {saved && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "#16a34a",
            fontWeight: 600,
            fontSize: 13.5,
            animation: "fadeInUp 0.3s ease",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(34,197,94,0.12)",
              fontSize: 12,
            }}>✓</span>
            Saved!
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyNote;
