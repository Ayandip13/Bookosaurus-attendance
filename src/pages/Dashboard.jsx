import React, { useEffect, useState, useMemo } from "react";
import { members } from "../members";
import AttendanceTable from "../components/AttendanceTable";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { toggleAttendance } from "../utils/markAttendance";
import DailyNote from "../components/DailyNote";

const Dashboard = () => {
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
    <div className="page">
      <h2>Team Attendance</h2>

      <div className="member-buttons">
        {members.map((m) => {
          const isPresent = attendanceMap[m.id]?.[today] || false;

          return (
            <button
              key={m.id}
              onClick={() => handleToggle(m.id, m.name)}
              className={isPresent ? "present" : "not-present"}
            >
              {isPresent ? `✓ Present — ${m.name}` : `Mark Present — ${m.name}`}
            </button>
          );
        })}
      </div>

      <AttendanceTable members={members} />
      {/* <DailyNote /> */}
    </div>
  );
};

export default Dashboard;
