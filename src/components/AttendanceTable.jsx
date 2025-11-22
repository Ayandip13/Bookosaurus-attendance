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
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr>
              <th style={{ padding: 10, background: "#e9edf2" }}>Member</th>

              {allDates.map((date) => (
                <th key={date} style={{ padding: 10, background: "#e9edf2" }}>
                  <div>{date}</div>
                  <div
                    onClick={() => notes[date] && openModal(date)}
                    style={{
                      fontSize: 12,
                      color: "#2563eb",
                      cursor: notes[date] ? "pointer" : "default",
                      opacity: notes[date] ? 0.8 : 0.4,
                      marginTop: 4,
                    }}
                  >
                    {notes[date] ? notes[date].slice(0, 20) + "…" : "No note"}
                  </div>
                </th>
              ))}
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
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                  }}
                >
                  {m.name}
                </td>

                {allDates.map((date) => {
                  const isPresent = records[m.id]?.[date];
                  const note = notes[date];

                  return (
                    <td
                      key={date}
                      style={{
                        padding: "10px 6px",
                        minWidth: "140px",
                        maxWidth: "140px",
                        textAlign: "center",
                        cursor: note ? "pointer" : "default",
                        background: isPresent ? "#d1fae5" : "#f9fafb",
                        border: "1px solid #eee",
                      }}
                      onClick={() => note && openModal(date)}
                    >
                      {isPresent ? "✔" : ""}
                      {/* <div style={{ fontSize: 12, opacity: 0.7 }}>
                        {note ? note.slice(0, 10) + "…" : ""}
                      </div> */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AttendanceTable;
