import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const AttendanceTable = ({ members }) => {
  const [records, setRecords] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const all = {};
      snapshot.forEach((doc) => {
        all[doc.id] = doc.data().dates || {};
      });
      setRecords(all);
    });

    return () => unsub();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Member</th>
          <th>Attendance Dates</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => {
          const dates = Object.keys(records[m.id] || {}).sort((a, b) =>
            b.localeCompare(a)
          );

          return (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>
                {dates.length ? (
                  dates.join(", ")
                ) : (
                  <span className="empty">No attendance yet</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AttendanceTable;
