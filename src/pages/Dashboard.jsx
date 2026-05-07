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

  return (
    <div
      className="page"
      style={{
        background: theme.cardBg,
        color: theme.textPrimary,
        minHeight: "100vh",
        borderRadius: 0,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.textPrimary,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 10,
              background: theme.primary,
              color: theme.textOnPrimary,
              fontSize: 18,
            }}
          >
            📋
          </span>
          Team Attendance
        </h2>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: theme.surfaceElevated,
            color: theme.textPrimary,
            border: `1px solid ${theme.border}`,
            padding: "8px 16px",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: theme.shadow,
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>
            {isDark ? "☀️" : "🌙"}
          </span>
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      {/* Attendance toggle buttons */}
      <div className="member-buttons">
        {members.map((m) => {
          const isPresent = attendanceMap[m.id]?.[today] || false;

          return (
            <button
              key={m.id}
              onClick={() => handleToggle(m.id, m.name)}
              style={{
                background: isPresent ? theme.btnPresentBg : theme.btnNotPresentBg,
                boxShadow: isPresent
                  ? `0 2px 8px rgba(5, 150, 105, 0.3)`
                  : `0 2px 8px rgba(0, 128, 128, 0.25)`,
              }}
            >
              {isPresent ? `✓ Present — ${m.name}` : `Mark Present — ${m.name}`}
            </button>
          );
        })}
      </div>

      <AttendanceTable members={members} />
      <DailyNote />
    </div>
  );
};

export default Dashboard;
