import React, { useEffect, useState, useMemo } from "react";
import { members } from "../members";
import AttendanceTable from "../components/AttendanceTable";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { toggleAttendance } from "../utils/markAttendance";
import DailyNote from "../components/DailyNote";
import { useTheme } from "../ThemeContext";

const DISMISSED_KEY = "attendance-dismissed-members";

/* ── Small member chip ── */
const MemberChip = ({ member, isPresent, onToggle, theme, draggable, onDragStart }) => {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        if (onDragStart) onDragStart(e, member.id);
      }}
      style={{ position: "relative", display: "inline-flex", cursor: draggable ? "grab" : "default" }}
    >
      <button
        onClick={() => onToggle(member.id, member.name)}
        style={{
          background: isPresent ? theme.btnPresentGradient : theme.btnAbsentGradient,
          boxShadow: isPresent ? theme.btnPresentShadow : theme.btnAbsentShadow,
          border: `1px solid ${isPresent ? theme.btnPresentBorder : theme.btnAbsentBorder}`,
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 10,
          fontSize: 13.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 7,
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        {isPresent ? (
          <><span style={{ fontSize: 15 }}>✓</span>{member.name}</>
        ) : (
          <><span style={{ fontSize: 14, opacity: 0.8 }}>+</span>{member.name}</>
        )}
      </button>
    </div>
  );
};

/* ── Main Dashboard ── */
const Dashboard = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [attendanceMap, setAttendanceMap] = useState({});
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DISMISSED_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [showRestorePanel, setShowRestorePanel] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Persist dismissed list
  useEffect(() => {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
  }, [dismissed]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const map = {};
      snapshot.forEach((doc) => {
        map[doc.id] = doc.data().dates || {};
      });
      setAttendanceMap(map);
    });
    return () => unsub();
  }, []);

  const handleToggle = async (id, name) => {
    await toggleAttendance(id, name);
  };

  const dismissMember = (id) => {
    if (!dismissed.includes(id)) {
      setDismissed((prev) => [...prev, id]);
    }
  };

  const restoreMember = (id) => {
    setDismissed((prev) => prev.filter((d) => d !== id));
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("memberId", id);
  };

  const handleDropToDismiss = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("memberId"), 10) || e.dataTransfer.getData("memberId");
    if (id) dismissMember(id);
  };

  const handleDropToRestore = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("memberId"), 10) || e.dataTransfer.getData("memberId");
    if (id) restoreMember(id);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const activeMembers = members.filter((m) => !dismissed.includes(m.id));
  const dismissedMembers = members.filter((m) => dismissed.includes(m.id));

  const presentCount = activeMembers.filter((m) => attendanceMap[m.id]?.[today]).length;
  const totalCount = activeMembers.length;

  return (
    <div
      className="page"
      style={{
        background: theme.pageBg,
        color: theme.textPrimary,
        minHeight: "100vh",
      }}
    >
      {/* ── Hero Header (Drop Zone for hiding) ── */}
      <div
        onDragOver={allowDrop}
        onDrop={handleDropToDismiss}
        style={{
          background: theme.heroGradient,
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 28,
          border: `1px solid ${theme.heroBorder}`,
          boxShadow: theme.heroShadow,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative orbs */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 180, height: 180, borderRadius: "50%",
          background: theme.orbColor, filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: 80,
          width: 120, height: 120, borderRadius: "50%",
          background: theme.orbColorAlt, filter: "blur(50px)", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          {/* Title + subtitle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: theme.iconBg,
              border: `1px solid ${theme.iconBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(91,155,213,0.15)",
            }}>
              📋
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.heroTitle, letterSpacing: "-0.03em" }}>
                Team Attendance
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: theme.heroSubtitle, marginTop: 2 }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Attendance badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: theme.statBg,
              border: `1px solid ${theme.statBorder}`,
              borderRadius: 12, padding: "8px 16px",
              backdropFilter: "blur(8px)",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: presentCount === totalCount ? "#4ade80" : "#60a5fa",
                boxShadow: `0 0 0 3px ${presentCount === totalCount ? "rgba(74,222,128,0.25)" : "rgba(96,165,250,0.25)"}`,
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.statText }}>
                {presentCount} / {totalCount} Present
              </span>
            </div>

            {/* Hidden members pill */}
            {dismissedMembers.length > 0 && (
              <button
                onClick={() => setShowRestorePanel((p) => !p)}
                style={{
                  background: showRestorePanel ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                {dismissedMembers.length} Hidden
              </button>
            )}
          </div>
        </div>

        {/* ── Restore panel ── */}
        {showRestorePanel && dismissedMembers.length > 0 && (
          <div style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.20)",
            position: "relative",
          }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Dismissed — drag out or click to restore
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {dismissedMembers.map((m) => (
                <div
                  key={m.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, m.id)}
                  onClick={() => { restoreMember(m.id); setShowRestorePanel(false); }}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.92)",
                    border: "1px dashed rgba(255,255,255,0.35)",
                    borderRadius: 8,
                    padding: "7px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "grab",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    transition: "background 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 14 }}>↩</span>
                  {m.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mark Attendance Buttons ── */}
      <div 
        style={{ marginBottom: 8 }}
        onDragOver={allowDrop}
        onDrop={handleDropToRestore}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Mark Today's Attendance
          <span style={{ marginLeft: 8, fontWeight: 400, textTransform: "none", fontSize: 11, letterSpacing: 0 }}>
            — drag a name to the blue box to hide
          </span>
        </p>
        <div className="member-buttons" style={{ minHeight: 60 }}>
          {activeMembers.map((m) => {
            const isPresent = attendanceMap[m.id]?.[today] || false;
            return (
              <MemberChip
                key={m.id}
                member={m}
                isPresent={isPresent}
                onToggle={handleToggle}
                theme={theme}
                draggable={true}
                onDragStart={handleDragStart}
              />
            );
          })}
        </div>
      </div>

      <AttendanceTable members={activeMembers} />
      <DailyNote />
    </div>
  );
};

export default Dashboard;
