import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const toggleAttendance = async (memberId, name) => {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, "attendance", memberId);

  const snap = await getDoc(ref);

  // If no record exists, create only today's attendance
  if (!snap.exists()) {
    await setDoc(ref, {
      name,
      dates: { [today]: true },
    });
    return true;
  }

  const data = snap.data();
  const dates = data.dates || {};

  // ❌ If trying to toggle any date other than today → block
  // (We ONLY toggle today's attendance)
  const alreadyPresent = dates[today] === true;

  if (alreadyPresent) {
    // Unmark only today
    delete dates[today];
  } else {
    // Mark only today
    dates[today] = true;
  }

  await updateDoc(ref, { dates });
  return !alreadyPresent;
};
