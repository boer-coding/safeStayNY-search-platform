import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { cyan } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import {HostPage} from "./pages/HostPage";
import {RecommendationPage} from "./pages/RecommendationPage";
import { CrimePage } from "./pages/CrimePage";


export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: cyan,
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
