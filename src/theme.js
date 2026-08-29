import { createTheme } from '@mui/material/styles';

// Цвета тем берутся из src/scss/_colors.scss. Здесь они продублированы как
// реальные значения, потому что MUI внутри себя вызывает alpha()/lighten() на
// цветах палитры (для hover/active состояний) — эти функции НЕ понимают var(),
// поэтому держать в палитре var(--color-0X) нельзя (упадёт в рантайме).
// Тему пересобираем при смене data-theme (см. index.js -> MuiThemeBridge).
const THEME_COLORS = {
  'dark-eclipse': {
    c01: 'rgb(255, 255, 255)', c02: 'rgb(185, 182, 182)', c03: 'rgb(252, 227, 175)',
    c04: 'rgb(145, 225, 70)', c05: 'rgb(225, 72, 70)', c06: 'rgb(47, 41, 45)',
    c07: 'rgb(39, 33, 33)', c08: 'rgb(41, 35, 37)', c09: 'rgb(0, 0, 0)', c10: 'rgb(30, 30, 30)',
  },
  'obsidian-flame': {
    c01: 'rgb(255, 255, 255)', c02: 'rgb(225, 150, 70)', c03: 'rgb(252, 227, 175)',
    c04: 'rgb(0, 128, 0)', c05: 'rgb(255, 0, 0)', c06: 'rgb(39, 41, 45)',
    c07: 'rgb(25, 27, 29)', c08: 'rgb(33, 35, 37)', c09: 'rgb(60, 60, 60)', c10: 'rgb(0, 0, 0)',
  },
  'midnight-bloom': {
    c01: 'rgb(30, 20, 60)', c02: 'rgb(50, 40, 90)', c03: 'rgb(70, 60, 120)',
    c04: 'rgb(40, 80, 50)', c05: 'rgb(150, 40, 50)', c06: 'rgb(160, 120, 210)',
    c07: 'rgb(190, 140, 230)', c08: 'rgb(200, 160, 230)', c09: 'rgb(210, 190, 235)', c10: 'rgb(220, 200, 235)',
  },
  'muted-earth': {
    c01: 'rgb(77, 75, 74)', c02: 'rgb(121, 90, 29)', c03: 'rgb(95, 94, 95)',
    c04: 'rgb(70, 98, 73)', c05: 'rgb(195, 107, 114)', c06: 'rgb(242, 242, 236)',
    c07: 'rgb(236, 234, 228)', c08: 'rgb(245, 243, 238)', c09: 'rgb(215, 213, 208)', c10: 'rgb(204, 204, 204)',
  },
  'muted-moon': {
    c01: 'rgb(33, 37, 49)', c02: 'rgb(36, 88, 203)', c03: 'rgb(96, 130, 210)',
    c04: 'rgb(84, 122, 114)', c05: 'rgb(174, 104, 124)', c06: 'rgb(241, 243, 248)',
    c07: 'rgb(226, 229, 235)', c08: 'rgb(234, 237, 243)', c09: 'rgb(205, 210, 219)', c10: 'rgb(188, 194, 205)',
  },
  'velvet-ember': {
    c01: 'rgb(85, 80, 78)', c02: 'rgb(130, 95, 45)', c03: 'rgb(100, 98, 99)',
    c04: 'rgb(75, 105, 78)', c05: 'rgb(200, 110, 120)', c06: 'rgb(230, 210, 190)',
    c07: 'rgb(220, 200, 175)', c08: 'rgb(240, 220, 200)', c09: 'rgb(210, 190, 165)', c10: 'rgb(180, 160, 140)',
  },
  'shadow-ember': {
    c01: 'rgb(250, 250, 250)', c02: 'rgb(200, 130, 60)', c03: 'rgb(240, 210, 160)',
    c04: 'rgb(20, 110, 20)', c05: 'rgb(210, 50, 50)', c06: 'rgb(45, 47, 52)',
    c07: 'rgb(30, 32, 34)', c08: 'rgb(35, 33, 36)', c09: 'rgb(50, 50, 50)', c10: 'rgb(20, 20, 20)',
  },
  'twilight-violet': {
    c01: 'rgb(255, 255, 255)', c02: 'rgb(185, 182, 182)', c03: 'rgb(252, 227, 175)',
    c04: 'rgb(145, 225, 70)', c05: 'rgb(225, 72, 70)', c06: 'rgb(65, 30, 75)',
    c07: 'rgb(45, 20, 60)', c08: 'rgb(40, 15, 55)', c09: 'rgb(20, 10, 40)', c10: 'rgb(30, 20, 50)',
  },
};

const DARK_THEMES = new Set(['dark-eclipse', 'obsidian-flame', 'shadow-ember', 'twilight-violet']);

export function createAppTheme(themeName) {
  const c = THEME_COLORS[themeName] || THEME_COLORS['shadow-ember'];
  const mode = DARK_THEMES.has(themeName) ? 'dark' : 'light';

  return createTheme({
    palette: {
      mode,
      primary: { main: c.c02, contrastText: c.c01 },
      secondary: { main: c.c03, contrastText: c.c01 },
      error: { main: c.c05, contrastText: '#ffffff' },
      success: { main: c.c04, contrastText: '#ffffff' },
      warning: { main: c.c02, contrastText: '#ffffff' },
      info: { main: c.c03, contrastText: '#ffffff' },
      background: { default: c.c07, paper: c.c08 },
      text: { primary: c.c01, secondary: c.c03 },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'inherit' },
  });
}

export default createAppTheme('shadow-ember');
