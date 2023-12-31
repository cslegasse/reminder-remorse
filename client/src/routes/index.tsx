import { Route, Routes } from "react-router-dom";
import { SignIn, SignedIn, SignedOut, SignUp, RedirectToSignIn } from "@clerk/clerk-react";
import { Tasks, AddTask, NotFound, Landing, Insights, Friends } from "@/pages";
import { Container } from "@mui/material";

function ProtectedPageParent({ children }: { children: JSX.Element }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/sign-in/*"
        element={
          <Container
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SignIn routing="path" path="/sign-in" />
          </Container>
        }
      />

      <Route
        path="/sign-up/*"
        element={
          <Container
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SignUp routing="path" path="/sign-up" />
          </Container>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedPageParent>
            <Tasks />
          </ProtectedPageParent>
        }
      />

      <Route
        path="/tasks/add"
        element={
          <ProtectedPageParent>
            <AddTask />
          </ProtectedPageParent>
        }
      />

      <Route
        path="/friends"
        element={
          <ProtectedPageParent>
            <Friends />
          </ProtectedPageParent>
        }
      />

      <Route
        path="/insights"
        element={
          <ProtectedPageParent>
            <Insights />
          </ProtectedPageParent>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
