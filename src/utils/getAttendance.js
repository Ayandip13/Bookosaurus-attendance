import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getAttendance = async (memberId) => {
  const ref = doc(db, "attendance", memberId);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data().dates : {};
};
