import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightTheme = {
  mode: "light",

  // ── Primary — sky blue ──
  primary: "#5b9bd5",
  primaryLight: "#7ab3e0",
  primaryDark: "#4a88c2",
  primaryGhost: "rgba(91, 155, 213, 0.07)",
  primaryGlow: "rgba(91, 155, 213, 0.15)",

  // ── Page background ──
  pageBg: "linear-gradient(160deg, #f0f6ff 0%, #f8fbff 50%, #eef4fb 100%)",

  // ── Card surfaces ──
  cardBg: "#ffffff",
  cardBgAlt: "#f9fbfe",
  surfaceElevated: "#ffffff",

  // ── Text ──
  textPrimary: "#1e3050",
  textSecondary: "#5a7094",
  textMuted: "#94aec4",
  textOnPrimary: "#ffffff",

  // ── Borders ──
  border: "#dce8f5",
  borderLight: "#eaf2fa",

  // ── Hero header ──
  heroGradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #60a5fa 100%)",
  heroBorder: "rgba(255,255,255,0.25)",
  heroShadow: "0 8px 40px rgba(37,99,235,0.25), 0 2px 8px rgba(37,99,235,0.10)",
  heroTitle: "#ffffff",
  heroSubtitle: "rgba(255,255,255,0.75)",
  orbColor: "rgba(147, 197, 253, 0.5)",
  orbColorAlt: "rgba(96, 165, 250, 0.3)",
  iconBg: "rgba(255,255,255,0.20)",
  iconBorder: "rgba(255,255,255,0.35)",

  // ── Stat badge ──
  statBg: "rgba(255,255,255,0.18)",
  statBorder: "rgba(255,255,255,0.30)",
  statText: "#ffffff",

  // ── Theme toggle ──
  toggleBg: "rgba(255,255,255,0.18)",
  toggleText: "#ffffff",
  toggleBorder: "rgba(255,255,255,0.30)",

  // ── Attendance buttons ──
  btnPresentGradient: "linear-gradient(135deg, #22c55e, #16a34a)",
  btnPresentBorder: "#16a34a",
  btnPresentShadow: "0 4px 14px rgba(34,197,94,0.30)",
  btnPresentText: "#ffffff",
  btnAbsentGradient: "linear-gradient(135deg, #4a88c2, #3b7fc4)",
  btnAbsentBorder: "#3b7fc4",
  btnAbsentShadow: "0 4px 14px rgba(74,136,194,0.25)",

  // ── Table ──
  tableHeaderBg: "linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)",
  tableRowHover: "rgba(91, 155, 213, 0.05)",
  tableCellBorder: "#e4eef8",

  // ── Members column ──
  membersColBg: "linear-gradient(90deg, #eff6ff, #f8fbff)",
  membersColBgAlt: "linear-gradient(90deg, #f8fbff, #eff6ff)",

  // ── Date header ──
  dateHeaderBg: "linear-gradient(180deg, #eff6ff, #f8fbff, #eff6ff)",

  // ── Present / absent ──
  presentBg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  presentColor: "#2563eb",

  // ── Notes ──
  noteLinkColor: "#4a88c2",
  noteEmptyColor: "#b8cedd",

  // ── Today / Yesterday tags ──
  todayBg: "rgba(37,99,235,0.10)",
  todayColor: "#2563eb",
  yesterdayBg: "rgba(124,107,196,0.10)",
  yesterdayColor: "#6d5fc7",

  // ── Daily note card ──
  textareaBg: "#ffffff",
  textareaBorder: "#d0e3f5",
  noteCardBg: "linear-gradient(135deg, #f8fbff, #eef4fb)",
  noteCardBorder: "#dce8f5",

  // ── Modal ──
  modalOverlay: "rgba(20,40,80,0.35)",
  modalBg: "#ffffff",

  // ── Shadows ──
  shadow: "0 2px 16px rgba(37,99,235,0.08), 0 1px 4px rgba(37,99,235,0.05)",
  shadowLg: "0 8px 40px rgba(37,99,235,0.12), 0 2px 12px rgba(37,99,235,0.06)",

  // ── Danger ──
  danger: "#ef4444",
};

const darkTheme = {
  mode: "dark",

  // ── Primary ──
  primary: "#60a5fa",
  primaryLight: "#93c5fd",
  primaryDark: "#3b82f6",
  primaryGhost: "rgba(96, 165, 250, 0.08)",
  primaryGlow: "rgba(96, 165, 250, 0.15)",

  // ── Page background ──
  pageBg: "linear-gradient(160deg, #0d1526 0%, #111827 50%, #0d1a2e 100%)",

  // ── Surfaces ──
  cardBg: "#172035",
  cardBgAlt: "#1c2740",
  surfaceElevated: "#1f2d4a",

  // ── Text ──
  textPrimary: "#e2eaf4",
  textSecondary: "#8ba4c0",
  textMuted: "#546a84",
  textOnPrimary: "#0d1526",

  // ── Borders ──
  border: "#243352",
  borderLight: "#1c2a45",

  // ── Hero header ──
  heroGradient: "linear-gradient(135deg, #1e3a5f 0%, #1d4480 40%, #1e4fa8 100%)",
  heroBorder: "rgba(96,165,250,0.15)",
  heroShadow: "0 8px 40px rgba(30,60,100,0.5), 0 2px 8px rgba(0,0,0,0.3)",
  heroTitle: "#e2eaf4",
  heroSubtitle: "rgba(226,234,244,0.60)",
  orbColor: "rgba(59,130,246,0.25)",
  orbColorAlt: "rgba(37,99,235,0.15)",
  iconBg: "rgba(96,165,250,0.15)",
  iconBorder: "rgba(96,165,250,0.25)",

  // ── Stat badge ──
  statBg: "rgba(96,165,250,0.10)",
  statBorder: "rgba(96,165,250,0.20)",
  statText: "#93c5fd",

  // ── Theme toggle ──
  toggleBg: "rgba(30,60,100,0.5)",
  toggleText: "#93c5fd",
  toggleBorder: "rgba(96,165,250,0.25)",

  // ── Attendance buttons ──
  btnPresentGradient: "linear-gradient(135deg, #16a34a, #15803d)",
  btnPresentBorder: "#166534",
  btnPresentShadow: "0 4px 14px rgba(22,163,74,0.25)",
  btnPresentText: "#ffffff",
  btnAbsentGradient: "linear-gradient(135deg, #1d4e8f, #1a4480)",
  btnAbsentBorder: "#1e40af",
  btnAbsentShadow: "0 4px 14px rgba(30,64,175,0.30)",

  // ── Table ──
  tableHeaderBg: "linear-gradient(135deg, #172035 0%, #1c2740 100%)",
  tableRowHover: "rgba(96,165,250,0.05)",
  tableCellBorder: "#243352",

  // ── Members column ──
  membersColBg: "linear-gradient(90deg, #172035, #1c2740)",
  membersColBgAlt: "linear-gradient(90deg, #1c2740, #172035)",

  // ── Date header ──
  dateHeaderBg: "linear-gradient(180deg, #172035, #1c2740, #172035)",

  // ── Present / absent ──
  presentBg: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.08))",
  presentColor: "#60a5fa",

  // ── Notes ──
  noteLinkColor: "#60a5fa",
  noteEmptyColor: "#3d5470",

  // ── Tags ──
  todayBg: "rgba(96,165,250,0.12)",
  todayColor: "#93c5fd",
  yesterdayBg: "rgba(167,139,250,0.12)",
  yesterdayColor: "#c4b5fd",

  // ── Daily note card ──
  textareaBg: "#1c2740",
  textareaBorder: "#243352",
  noteCardBg: "linear-gradient(135deg, #172035, #1c2740)",
  noteCardBorder: "#243352",

  // ── Modal ──
  modalOverlay: "rgba(0,0,0,0.60)",
  modalBg: "#172035",

  // ── Shadows ──
  shadow: "0 2px 16px rgba(0,0,0,0.30), 0 1px 4px rgba(0,0,0,0.20)",
  shadowLg: "0 8px 40px rgba(0,0,0,0.45), 0 2px 12px rgba(0,0,0,0.25)",

  // ── Danger ──
  danger: "#f87171",
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
    document.body.style.background = theme.pageBg;
    document.body.style.color = theme.textPrimary;
    document.body.style.transition = "background 0.4s ease, color 0.4s ease";
  }, [isDark, theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
