import { createTheme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#1A1A1A",
  fontLight: "#F5F5F5",
  purple: "#b624ff",
  red: "#ff3131",
};

export const MuiTheme = createTheme({
  palette: {
    primary: {
      main: ColorPalette.purple,
    },
    error: {
      main: ColorPalette.red,
    },
    text: {
      primary: ColorPalette.fontLight,
      secondary: ColorPalette.fontDark,
    },
  },

  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },

  components: {
    MuiTooltip: {
      defaultProps: {
        disableInteractive: true,
      },
      styleOverrides: {
        tooltip: {
          color: "white",
          backgroundColor: "#141431dd",
          backdropFilter: "blur(6px)",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "12px",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiDialog: {
      styleOverrides: {
        container: {
          backdropFilter: "blur(4px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation8: {
          borderRadius: "16px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          gap: "4px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg, #232e58 0%, #171d34 100%)",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "8px",
            backgroundColor: "#232e58",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#6d2aff",
            borderRadius: "64px",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#8750ff",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#232e58",
            borderRadius: "64px",
          },
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});
