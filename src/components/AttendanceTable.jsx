import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import NoteModal from "./NoteModal";
import { useTheme } from "../ThemeContext";

const AttendanceTable = ({ members }) => {
  const { theme } = useTheme();
  const [records, setRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [modalData, setModalData] = useState(null);
  const [showTotal, setShowTotal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const parseISODate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y.slice(-2)}`;
  };

  const weekdayName = (iso) =>
    parseISODate(iso).toLocaleDateString(undefined, { weekday: "long" });

  const relativeLabel = (iso) => {
    const dt = parseISODate(iso);
    const now = new Date();
    const toMid = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((toMid(dt) - toMid(now)) / 86400000);
    if (diff === 0) return "Today";
    if (diff === -1) return "Yesterday";
    if (diff === 1) return "Tomorrow";
    return "";
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const all = {};
      snapshot.forEach((d) => { all[d.id] = d.data().dates || {}; });
      setRecords(all);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notes"), (snapshot) => {
      const all = {};
      snapshot.forEach((d) => { all[d.id] = d.data().text; });
      setNotes(all);
    });
    return () => unsub();
  }, []);

  const allDates = useMemo(() =>
    Array.from(
      new Set(Object.values(records).flatMap((d) => Object.keys(d || {})))
    ).sort((a, b) => b.localeCompare(a)),
    [records]
  );

  const openModal = (date) =>
    setModalData({ date, text: notes[date] ?? "", canDelete: date === today });

  const deleteNote = async (date) => {
    await deleteDoc(doc(db, "notes", date));
    setModalData(null);
  };

  // ── Shared styles ──
  const MEMBER_W = 110;   // px — width of the sticky Members column
  const TOTAL_W  = 60;    // px — width of the sticky Total column
  const ROW_H    = 46;    // px — fixed body row height

  const stickyBase = {
    position: "sticky",
    zIndex: 2,
  };

  const memberColStyle = {
    ...stickyBase,
    left: 0,
    width: MEMBER_W,
    minWidth: MEMBER_W,
    maxWidth: MEMBER_W,
    background: theme.membersColBg,
  };

  const totalColStyle = {
    ...stickyBase,
    left: MEMBER_W,
    width: TOTAL_W,
    minWidth: TOTAL_W,
    maxWidth: TOTAL_W,
    background: theme.membersColBgAlt,
    overflow: "hidden",
    transition: "width 0.35s ease, min-width 0.35s ease, opacity 0.35s ease, padding 0.35s ease",
    ...(showTotal
      ? { opacity: 1, padding: "0 12px" }
      : { width: 0, minWidth: 0, maxWidth: 0, opacity: 0, padding: 0 }),
  };

  return (
    <>
      {modalData && (
        <NoteModal
          open
          date={modalData.date}
          text={modalData.text}
          onClose={() => setModalData(null)}
          onDelete={modalData.canDelete ? () => deleteNote(modalData.date) : null}
        />
      )}

      {/* Single scrollable container — one table, sticky left cols */}
      <div
        style={{
          width: "100%",
          borderRadius: 16,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          background: theme.cardBg,
          overflowX: "auto",
          overflowY: "visible",
          // give the sticky cols a shadow so they visually separate from scroll content
          WebkitOverflowScrolling: "touch",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            fontSize: 14,
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {/* ── THEAD ── */}
          <thead>
            <tr>
              {/* Members header — sticky */}
              <th
                onDoubleClick={() => setShowTotal((p) => !p)}
                title="Double-click to toggle totals"
                style={{
                  ...memberColStyle,
                  padding: "14px 12px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: theme.textPrimary,
                  borderBottom: `2px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                  cursor: "pointer",
                  userSelect: "none",
                  zIndex: 3,
                  verticalAlign: "bottom",
                }}
              >
                Members
              </th>

              {/* Total header — sticky, collapsible */}
              <th
                style={{
                  ...totalColStyle,
                  padding: showTotal ? "14px 8px" : "14px 0",
                  textAlign: "center",
                  fontWeight: 700,
                  color: theme.textPrimary,
                  borderBottom: `2px solid ${theme.border}`,
                  borderRight: showTotal ? `1px solid ${theme.border}` : "none",
                  whiteSpace: "nowrap",
                  zIndex: 3,
                  verticalAlign: "bottom",
                }}
              >
                {showTotal ? "Total" : ""}
              </th>

              {/* Date headers */}
              {allDates.map((date) => {
                const rel = relativeLabel(date);
                return (
                  <th
                    key={date}
                    style={{
                      padding: "10px 12px",
                      background: theme.dateHeaderBg,
                      textAlign: "center",
                      minWidth: 110,
                      borderBottom: `2px solid ${theme.border}`,
                      borderLeft: `1px solid ${theme.tableCellBorder}`,
                      color: theme.textPrimary,
                      fontWeight: 400,
                      verticalAlign: "top",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatDate(date)}</div>
                    <div style={{ marginTop: 3, fontSize: 11.5, color: theme.textSecondary }}>
                      {weekdayName(date)}
                      {rel && (
                        <span style={{
                          marginLeft: 5,
                          padding: "1px 6px",
                          background: rel === "Today" ? theme.todayBg : theme.yesterdayBg,
                          color: rel === "Today" ? theme.todayColor : theme.yesterdayColor,
                          fontSize: 10,
                          borderRadius: 6,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}>
                          {rel}
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => notes[date] && openModal(date)}
                      style={{
                        marginTop: 5,
                        fontSize: 11,
                        cursor: notes[date] ? "pointer" : "default",
                        color: notes[date] ? theme.noteLinkColor : theme.noteEmptyColor,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 100,
                      }}
                    >
                      {notes[date] ? notes[date].slice(0, 18) + "…" : "No note"}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── TBODY ── */}
          <tbody>
            {members.map((m, i) => {
              const totalAttendance = allDates.filter((d) => records[m.id]?.[d]).length;
              const isEven = i % 2 === 0;

              return (
                <tr key={m.id}>
                  {/* Member name — sticky */}
                  <td
                    style={{
                      ...memberColStyle,
                      padding: "0 12px",
                      height: ROW_H,
                      fontWeight: 600,
                      color: theme.textPrimary,
                      borderBottom: `1px solid ${theme.tableCellBorder}`,
                      borderRight: `1px solid ${theme.border}`,
                      // subtle alternating bg
                      background: isEven
                        ? theme.membersColBg
                        : theme.membersColBgAlt,
                      boxShadow: "2px 0 6px rgba(91,155,213,0.06)",
                    }}
                  >
                    {m.name}
                  </td>

                  {/* Total — sticky, collapsible */}
                  <td
                    style={{
                      ...totalColStyle,
                      height: ROW_H,
                      textAlign: "center",
                      fontWeight: 700,
                      color: theme.presentColor,
                      borderBottom: `1px solid ${theme.tableCellBorder}`,
                      borderRight: showTotal ? `1px solid ${theme.border}` : "none",
                      background: isEven
                        ? theme.membersColBgAlt
                        : theme.membersColBg,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {showTotal ? totalAttendance : ""}
                  </td>

                  {/* Attendance cells */}
                  {allDates.map((date) => {
                    const isPresent = !!records[m.id]?.[date];
                    return (
                      <td
                        key={date}
                        style={{
                          height: ROW_H,
                          textAlign: "center",
                          minWidth: 110,
                          background: isPresent ? theme.presentBg : theme.cardBg,
                          border: `1px solid ${theme.tableCellBorder}`,
                          color: isPresent ? theme.presentColor : theme.textMuted,
                          fontWeight: isPresent ? 700 : 400,
                          fontSize: isPresent ? 17 : 14,
                          transition: "background 0.2s ease",
                        }}
                      >
                        {isPresent ? "✔" : ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AttendanceTable;