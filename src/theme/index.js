import { colors } from './colors';

export const theme = {
  colors,
  fonts: {
    thai: "'Prompt', 'Sarabun', sans-serif",
    english: "'Poppins', 'Inter', sans-serif",
    weights: {
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: `0 2px 4px ${colors.shadow.light}`,
    md: `0 4px 8px ${colors.shadow.light}`,
    lg: `0 8px 16px ${colors.shadow.medium}`,
    xl: `0 12px 24px ${colors.shadow.medium}`,
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export { colors };
export default theme;

