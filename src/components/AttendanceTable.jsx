import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import NoteModal from "./NoteModal";

const AttendanceTable = ({ members }) => {
  const [records, setRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [modalData, setModalData] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  // safe parse of yyyy-mm-dd into local Date (avoids timezone shifts)
  const parseISODate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // return weekday name like "Monday"
  const weekdayName = (iso) => {
    const dt = parseISODate(iso);
    return dt.toLocaleDateString(undefined, { weekday: "long" });
  };

  // return relative label: "Today", "Yesterday", "Tomorrow" or empty string
  const relativeLabel = (iso) => {
    const dt = parseISODate(iso);
    const today = new Date();
    // normalize both to local midnight for accurate day diff
    const toMidnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffMs = toMidnight(dt) - toMidnight(today);
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";
    return "";
  };

  useEffect(() => {
    // Load attendance
    const unsub = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const all = {};
      snapshot.forEach((doc) => {
        all[doc.id] = doc.data().dates || {};
      });
      setRecords(all);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Load notes
    const unsub = onSnapshot(collection(db, "notes"), (snapshot) => {
      const all = {};
      snapshot.forEach((doc) => {
        all[doc.id] = doc.data().text;
      });
      setNotes(all);
    });
    return () => unsub();
  }, []);

  // Collect all dates across all members
  const allDates = Array.from(
    new Set(Object.values(records).flatMap((dates) => Object.keys(dates || {})))
  ).sort((a, b) => a.localeCompare(b));

  const openModal = (date) => {
    setModalData({
      date,
      text: notes[date] ?? "",
      canDelete: date === today,
    });
  };

  const deleteNote = async (date) => {
    await deleteDoc(doc(db, "notes", date));
    setModalData(null);
  };

  return (
    <>
      {modalData && (
        <NoteModal
          open={true}
          date={modalData.date}
          text={modalData.text}
          onClose={() => setModalData(null)}
          onDelete={
            modalData.canDelete ? () => deleteNote(modalData.date) : null
          }
        />
      )}
      <div style={{ display: "flex", width: "100%" }}>
        {/* Fixed member column */}
        <div style={{ flex: "0 0 auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: "30px",
                    background: "#e9edf2",
                    minWidth: "100px",
                    textAlign: "center",
                  }}
                >
                  Members
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td
                    style={{
                      padding: 10,
                      fontWeight: 600,
                      minWidth: "170px",
                      maxWidth: "170px",
                      background: "#fff",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {m.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scrollable attendance dates */}
        <div style={{ flex: "1 1 auto", overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr>
                {allDates.map((date) => {
                  const wd = weekdayName(date);
                  const rel = relativeLabel(date);
                  return (
                    <th
                      key={date}
                      style={{
                        padding: 10,
                        background: "#e9edf2",
                        textAlign: "center",
                        minWidth: "180px",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{date}</div>

                      <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>
                        {wd}
                        {rel ? (
                          <span
                            style={{
                              marginLeft: 6,
                              padding: "2px 6px",
                              background: rel === "Today" ? "#fde68a" : "#dbeafe",
                              color: rel === "Today" ? "#92400e" : "#1e3a8a",
                              fontSize: 11,
                              borderRadius: 6,
                              fontWeight: 600,
                            }}
                          >
                            {rel}
                          </span>
                        ) : null}
                      </div>

                      {/* NOTE ONLY IN HEADER */}
                      <div
                        onClick={() => notes[date] && openModal(date)}
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          cursor: notes[date] ? "pointer" : "default",
                          color: notes[date] ? "#2563eb" : "#999",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {notes[date]
                          ? notes[date].slice(0, 20) + "…"
                          : "No note"}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  {allDates.map((date) => {
                    const isPresent = records[m.id]?.[date];

                    return (
                      <td
                        key={date}
                        style={{
                          padding: 10,
                          textAlign: "center",
                          minWidth: "180px",
                          background: isPresent ? "#d1fae5" : "#f9fafb",
                          border: "1px solid #eee",
                        }}
                      >
                        {isPresent ? "✔" : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendanceTable;
