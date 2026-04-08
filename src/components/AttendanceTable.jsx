import React, { useEffect, useMemo, useState } from "react";
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
  const [showTotal, setShowTotal] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  // safe parse of yyyy-mm-dd into local Date (avoids timezone shifts)
  const parseISODate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    const yy = y.slice(-2);
    return `${d}/${m}/${yy}`;
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

  const allDates = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(records).flatMap((dates) => Object.keys(dates || {}))
      )
    ).sort((a, b) => b.localeCompare(a));   // ← THIS IS THE ONLY CHANGE
  }, [records]);

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
        <div style={{ flex: "0 0 auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th
                  onDoubleClick={() => setShowTotal(!showTotal)}
                  style={{
                    padding: "31px",
                    background: "linear-gradient(90deg, #d4f2ff, #feffff)",
                    minWidth: "80px",
                    textAlign: "center",
                    borderBottom: "1px dashed #d0d0d0",
                    borderRadius: "8px 0 0 0",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  Members
                </th>
                <th
                  style={{
                    padding: showTotal ? "31px 15px" : "31px 0px",
                    background: "linear-gradient(90deg, #feffff, #d4f2ff)",
                    textAlign: "center",
                    borderBottom: showTotal ? "1px dashed #d0d0d0" : "1px solid transparent",
                    width: showTotal ? "60px" : "0px",
                    minWidth: showTotal ? "60px" : "0px",
                    maxWidth: showTotal ? "60px" : "0px",
                    opacity: showTotal ? 1 : 0,
                    overflow: "hidden",
                    transition: "all 0.4s ease-in-out",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ width: showTotal ? "auto" : 0, overflow: "hidden" }}>
                    Total
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const totalAttendance = allDates.filter((date) => records[m.id]?.[date]).length;
                return (
                  <tr key={m.id}>
                    <td
                      style={{
                        padding: 10,
                        fontWeight: 600,
                        minWidth: "70px",
                        maxWidth: "70px",
                        background: "linear-gradient(90deg, #d4f2ff, #feffff)",
                        borderBottom: "1px solid #d0d0d0",
                      }}
                    >
                      {m.name}
                    </td>
                    <td
                      style={{
                        padding: showTotal ? "10px" : "10px 0px",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: showTotal ? "40px" : "0px",
                        minWidth: showTotal ? "40px" : "0px",
                        maxWidth: showTotal ? "40px" : "0px",
                        background: "linear-gradient(90deg, #feffff, #d4f2ff)",
                        borderBottom: showTotal ? "1px solid #d0d0d0" : "1px solid transparent",
                        color: "#059669",
                        opacity: showTotal ? 1 : 0,
                        overflow: "hidden",
                        transition: "all 0.4s ease-in-out",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div style={{ width: showTotal ? "100%" : 0, overflow: "hidden" }}>
                        {totalAttendance}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scrollable attendance dates */}
        <div style={{ flex: "1 1 auto", overflowX: "auto", }}>
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
                        background: "linear-gradient(180deg, #d4f2ff, #feffff, #d4f2ff)",
                        textAlign: "center",
                        minWidth: "100px",
                        borderBottom: "2px dotted #d0d0d0",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{formatDate(date)}</div>
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
                              textTransform: "uppercase",
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
                          color: notes[date] ? "#2563eb" : "#888",
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
                          minWidth: "100px",
                          background: isPresent ? "#d1fae5" : "#fff",
                          border: "1px solid #d0d0d0",
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