import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const DailyNote = () => {
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
    <div style={{ marginTop: 30, marginBottom: 30 }}>
      <h3 style={{ marginBottom: 10 }}>📝 Today's Summary</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write today's summary..."
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "15px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={saveNote}
        style={{
          marginTop: 10,
          padding: "10px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Save Summary
      </button>

      {saved && <p style={{ color: "green", marginTop: 8 }}>✓ Saved!</p>}
    </div>
  );
};

export default DailyNote;
