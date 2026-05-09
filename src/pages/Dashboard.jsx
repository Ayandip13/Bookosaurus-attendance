import React, { useEffect, useState, useMemo } from "react";
import { members } from "../members";
import AttendanceTable from "../components/AttendanceTable";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { toggleAttendance } from "../utils/markAttendance";
import DailyNote from "../components/DailyNote";
import { useTheme } from "../ThemeContext";

const Dashboard = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [attendanceMap, setAttendanceMap] = useState({});
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

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

  const presentCount = members.filter((m) => attendanceMap[m.id]?.[today]).length;
  const totalCount = members.length;

  return (
    <div
      className="page"
      style={{
        background: theme.pageBg,
        color: theme.textPrimary,
        minHeight: "100vh",
      }}
    >
      {/* ── Hero Header ── */}
      <div
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
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
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
          </div>

          {/* Right: stats + theme toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                background: presentCount === totalCount ? "#4ade80" : "#5b9bd5",
                boxShadow: `0 0 0 3px ${presentCount === totalCount ? "rgba(74,222,128,0.2)" : "rgba(91,155,213,0.2)"}`,
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.statText }}>
                {presentCount} / {totalCount} Present
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: theme.toggleBg,
                color: theme.toggleText,
                border: `1px solid ${theme.toggleBorder}`,
                padding: "8px 14px",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{isDark ? "☀️" : "🌙"}</span>
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mark Attendance Buttons ── */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Mark Today's Attendance
        </p>
        <div className="member-buttons">
          {members.map((m) => {
            const isPresent = attendanceMap[m.id]?.[today] || false;
            return (
              <button
                key={m.id}
                onClick={() => handleToggle(m.id, m.name)}
                style={{
                  background: isPresent ? theme.btnPresentGradient : theme.btnAbsentGradient,
                  boxShadow: isPresent ? theme.btnPresentShadow : theme.btnAbsentShadow,
                  border: `1px solid ${isPresent ? theme.btnPresentBorder : theme.btnAbsentBorder}`,
                  color: isPresent ? theme.btnPresentText : "#fff",
                  padding: "10px 20px",
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {isPresent ? (
                  <>
                    <span style={{ fontSize: 15 }}>✓</span>
                    {m.name}
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 14, opacity: 0.8 }}>+</span>
                    {m.name}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AttendanceTable members={members} />
      <DailyNote />
    </div>
  );
};

export default Dashboard;
