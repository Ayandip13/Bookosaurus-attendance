import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useTheme } from "../ThemeContext";

const DailyNote = () => {
  const { theme } = useTheme();
  const today = new Date().toISOString().split("T")[0];
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  // Load existing note
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
    await setDoc(ref, {
      text,
      updatedAt: serverTimestamp(),
    });
    console.log('saved');
    setSaved(true);
    setText("");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        marginTop: 30,
        marginBottom: 30,
        padding: 20,
        background: theme.cardBgAlt,
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
      }}
    >
      <h3
        style={{
          marginBottom: 12,
          color: theme.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        📝 Today's Summary
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write today's summary..."
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "14px",
          borderRadius: "10px",
          fontSize: "15px",
          border: `1px solid ${theme.textareaBorder}`,
          background: theme.textareaBg,
          color: theme.textPrimary,
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.25s ease",
          fontFamily: "inherit",
        }}
        onFocus={(e) => (e.target.style.borderColor = theme.primary)}
        onBlur={(e) => (e.target.style.borderColor = theme.textareaBorder)}
      />

      <button
        onClick={saveNote}
        style={{
          marginTop: 12,
          padding: "10px 20px",
          background: theme.primary,
          color: theme.textOnPrimary,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 14,
          boxShadow: `0 2px 8px rgba(0, 128, 128, 0.25)`,
          transition: "all 0.25s ease",
        }}
      >
        Save Summary
      </button>

      {saved && (
        <p
          style={{
            color: theme.presentColor,
            marginTop: 10,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ✓ Saved!
        </p>
      )}
    </div>
  );
};

export default DailyNote;
