import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Box, Container } from "@mui/material";
import { Header } from "./Header";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Container
        sx={{
          padding: 2,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Box component="main" mt={2} flex={1}>
          {children}
        </Box>
        <BottomNav />
      </Container>
    </>
  );
};
