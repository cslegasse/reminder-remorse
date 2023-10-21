import { ClerkProvider } from "@clerk/clerk-react";
import { CLERK_PUBLISHABLE_KEY } from "./config";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Routes } from "./Routes";
import { CssBaseline } from "@mui/material";

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

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AuthProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;
