import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightTheme = {
  mode: "light",
  // Primary teal palette
  primary: "#008080",
  primaryLight: "#00a3a3",
  primaryDark: "#006666",
  primaryGhost: "rgba(0, 128, 128, 0.08)",
  primaryGlow: "rgba(0, 128, 128, 0.15)",
  // Surfaces
  pageBg: "#f0f5f5",
  cardBg: "#ffffff",
  cardBgAlt: "#f7fafa",
  surfaceElevated: "#ffffff",
  // Text
  textPrimary: "#1a2e2e",
  textSecondary: "#4a6363",
  textMuted: "#7a9999",
  textOnPrimary: "#ffffff",
  // Borders
  border: "#d0e0e0",
  borderLight: "#e0ecec",
  // Table
  tableHeaderBg: "linear-gradient(135deg, #e0f2f2 0%, #f0fafa 100%)",
  tableRowHover: "rgba(0, 128, 128, 0.04)",
  tableCellBorder: "#e0ecec",
  // Members column
  membersColBg: "linear-gradient(90deg, #e0f2f2, #f5fafa)",
  membersColBgAlt: "linear-gradient(90deg, #f5fafa, #e0f2f2)",
  // Date header
  dateHeaderBg: "linear-gradient(180deg, #e0f2f2, #f5fafa, #e0f2f2)",
  // Present / absent
  presentBg: "#d1fae5",
  presentColor: "#059669",
  // Notes
  noteLinkColor: "#008080",
  noteEmptyColor: "#aaa",
  // Tag
  todayBg: "#ccfbf1",
  todayColor: "#0f766e",
  yesterdayBg: "#e0f2fe",
  yesterdayColor: "#0369a1",
  // Buttons
  btnPresentBg: "#059669",
  btnNotPresentBg: "#008080",
  // DailyNote
  textareaBg: "#ffffff",
  textareaBorder: "#c0d8d8",
  // Modal
  modalOverlay: "rgba(0, 40, 40, 0.5)",
  modalBg: "#ffffff",
  // Shadows
  shadow: "0 2px 12px rgba(0, 80, 80, 0.08)",
  shadowLg: "0 8px 32px rgba(0, 80, 80, 0.12)",
  // Danger
  danger: "#e11d48",
};

const darkTheme = {
  mode: "dark",
  // Primary teal palette
  primary: "#2dd4bf",
  primaryLight: "#5eead4",
  primaryDark: "#14b8a6",
  primaryGhost: "rgba(45, 212, 191, 0.08)",
  primaryGlow: "rgba(45, 212, 191, 0.12)",
  // Surfaces
  pageBg: "#0f1a1a",
  cardBg: "#1a2828",
  cardBgAlt: "#1f2f2f",
  surfaceElevated: "#243636",
  // Text
  textPrimary: "#e0f0f0",
  textSecondary: "#9ab8b8",
  textMuted: "#6a8888",
  textOnPrimary: "#0f1a1a",
  // Borders
  border: "#2a4040",
  borderLight: "#1f3535",
  // Table
  tableHeaderBg: "linear-gradient(135deg, #1a2e2e 0%, #1f3535 100%)",
  tableRowHover: "rgba(45, 212, 191, 0.04)",
  tableCellBorder: "#2a4040",
  // Members column
  membersColBg: "linear-gradient(90deg, #1a2e2e, #1f3535)",
  membersColBgAlt: "linear-gradient(90deg, #1f3535, #1a2e2e)",
  // Date header
  dateHeaderBg: "linear-gradient(180deg, #1a2e2e, #1f3535, #1a2e2e)",
  // Present / absent
  presentBg: "rgba(5, 150, 105, 0.2)",
  presentColor: "#34d399",
  // Notes
  noteLinkColor: "#2dd4bf",
  noteEmptyColor: "#5a7070",
  // Tag
  todayBg: "rgba(45, 212, 191, 0.15)",
  todayColor: "#5eead4",
  yesterdayBg: "rgba(96, 165, 250, 0.15)",
  yesterdayColor: "#93c5fd",
  // Buttons
  btnPresentBg: "#059669",
  btnNotPresentBg: "#0f766e",
  // DailyNote
  textareaBg: "#1f2f2f",
  textareaBorder: "#2a4040",
  // Modal
  modalOverlay: "rgba(0, 0, 0, 0.7)",
  modalBg: "#1a2828",
  // Shadows
  shadow: "0 2px 12px rgba(0, 0, 0, 0.3)",
  shadowLg: "0 8px 32px rgba(0, 0, 0, 0.5)",
  // Danger
  danger: "#fb7185",
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("attendance-theme");
    return saved === "dark";
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("attendance-theme", isDark ? "dark" : "light");
    document.body.style.backgroundColor = theme.pageBg;
    document.body.style.color = theme.textPrimary;
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
  }, [isDark, theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
