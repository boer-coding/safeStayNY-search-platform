import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { cyan } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { HostPage } from "./pages/HostPage";
import { RecommendationPage } from "./pages/RecommendationPage";
import { CrimePage } from "./pages/CrimePage";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#bbdefb",
    },
    secondary: {
      main: "#f06292",
    },
    background: {
      default: "#f6efe3", // Applies to the background of the <body>
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#829baf",
          color: "white", // White text
          "&:hover": {
            backgroundColor: "#687785",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#2e7031",
          "&:hover": {
            color: "#124116",
            cursor: "pointer",
          },
        },
      },
    },
    // typography: {
    //   h2: {
    //     fontSize: "1.5rem", // Typical font-size for h2 in Material-UI
    //     color: "tomato", // Custom color
    //     fontWeight: 500, // Typical font-weight for h2
    //   },
    // },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hosts" element={<HostPage />} />
          <Route path="/crime" element={<CrimePage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
