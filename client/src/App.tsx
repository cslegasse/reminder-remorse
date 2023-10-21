import { ClerkProvider } from "@clerk/clerk-react";
import { CLERK_PUBLISHABLE_KEY } from "@/config";
import { ColorPalette, MuiTheme } from "@/styles";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ErrorBoundary, GlobalStyles } from "@/components";
import { MainLayout } from "@/layouts/MainLayout";
import { AppRouter } from "@/routes";
import { Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "@/hooks/useResponsiveDisplay";
import { BrowserRouter, useNavigate } from "react-router-dom";

function App() {
  const isMobile = useResponsiveDisplay();
  return (
    <BrowserRouter>
      <ThemeProvider theme={MuiTheme}>
        <CssBaseline />
        <GlobalStyles />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            marginBottom: isMobile ? "84px" : "12px",
          }}
          toastOptions={{
            position: "bottom-center",
            duration: 4000,
            style: {
              padding: "14px 22px",
              borderRadius: "20px",
              fontSize: "17px",
              border: `2px solid ${ColorPalette.purple}`,
              background: "#141431e0",
              backdropFilter: "blur(6px)",
              color: ColorPalette.fontLight,
            },
            success: {
              iconTheme: {
                primary: ColorPalette.purple,
                secondary: "white",
              },
              style: {},
            },
            error: {
              iconTheme: {
                primary: "#ff3030",
                secondary: "white",
              },
              style: {
                borderColor: "#ff3030",
              },
            },
          }}
        />
        <ErrorBoundary>
          <AuthWithRoutesProvider />
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
}

const AuthWithRoutesProvider = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: theme.palette.primary.main,
          colorDanger: theme.palette.error.main,
          colorSuccess: theme.palette.success.main,
          colorWarning: theme.palette.warning.main,
        },
        elements: {
          rootBox: {
            display: "flex",
            alignItems: "center",
          },
        },
      }}
      navigate={(to) => {
        navigate(to);
      }}
    >
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </ClerkProvider>
  );
};
export default App;
