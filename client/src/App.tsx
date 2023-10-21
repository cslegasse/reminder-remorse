import { ClerkProvider } from "@clerk/clerk-react";
import { CLERK_PUBLISHABLE_KEY } from "./config";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Routes } from "./Routes";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PageHeader from "./components/PageHeader";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const AuthProviderWithRoutes = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <Routes />
    </ClerkProvider>
  );
};

const themeLight = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#DBF3FA",
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={themeLight}>
      <BrowserRouter>
        <CssBaseline />
        <AuthProviderWithRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
